/**
 * ESP32 Walker Monitoring System
 *
 * Tracks walker usage patterns including weight distribution, distance traveled,
 * and session duration to help monitor mobility trends.
 *
 * Features:
 * - Dual load cell monitoring (HX711 amplifiers)
 * - Rotary encoder distance tracking
 * - Local session storage (SPIFFS)
 * - WiFi connectivity and cloud sync
 * - Optional OLED display
 * - Power saving sleep modes
 *
 * @version 1.0.0
 * @author Walker Monitoring System
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <HX711.h>
#include <Wire.h>

#if ENABLE_DISPLAY
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#endif

#include "config.h"

// ============================================================================
// GLOBAL OBJECTS
// ============================================================================

// Load Cell objects
HX711 loadcell1;
HX711 loadcell2;

// Display object
#if ENABLE_DISPLAY
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#endif

// NTP Client for time synchronization
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_SERVER, NTP_OFFSET_SECONDS, NTP_UPDATE_INTERVAL);

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

// System State
enum SystemState {
    STATE_INIT,
    STATE_IDLE,
    STATE_IN_USE,
    STATE_CALIBRATING,
    STATE_UPLOADING,
    STATE_SLEEPING
};
SystemState currentState = STATE_INIT;

// Session Data Structure
struct Session {
    unsigned long startTime;      // Unix timestamp
    unsigned long endTime;        // Unix timestamp
    unsigned long duration;       // Duration in seconds
    float distanceCm;            // Distance in centimeters
    float avgWeightLb;           // Average weight in pounds
    float maxWeightLb;           // Peak weight during session
    bool uploaded;               // Whether session has been uploaded
};

// Current session tracking
Session currentSession;
bool sessionActive = false;
unsigned long sessionStartMillis = 0;
unsigned long lastWeightDetectedMillis = 0;
float weightSumForAverage = 0.0f;
int weightSampleCount = 0;

// Encoder tracking
volatile long encoderPosition = 0;
volatile long lastEncoderPosition = 0;
volatile unsigned long lastEncoderTime = 0;

// Weight tracking
float currentWeight1 = 0.0f;
float currentWeight2 = 0.0f;
float currentTotalWeight = 0.0f;

// WiFi state
bool wifiConnected = false;
unsigned long lastWifiAttempt = 0;
int wifiRetryCount = 0;

// Display state
unsigned long lastDisplayUpdate = 0;
float todayTotalDistance = 0.0f;
int todaySessionCount = 0;

// Power management
unsigned long lastActivityMillis = 0;

// Storage
int storedSessionCount = 0;

// Calibration state
bool calibrationMode = false;
unsigned long calibrationStartTime = 0;


// ============================================================================
// FUNCTION DECLARATIONS
// ============================================================================

void setupWiFi();
void connectWiFi();
void setupLoadCells();
void setupEncoder();
void setupDisplay();
void setupStorage();
void syncTime();

void readLoadCells();
void checkEncoderButton();
void updateSession();
void startSession();
void endSession();
void saveSession(Session &session);
void uploadSessions();
void uploadSession(Session &session);

void updateDisplay();
void displayStatus(String status);
void displaySession();

void enterCalibrationMode();
void performCalibration();

void enterDeepSleep();
void checkBattery();

float lbsToKg(float lbs);
float kgToLbs(float kg);
float cmToFeet(float cm);
float cmToMeters(float cm);

// Interrupt handler for encoder
void IRAM_ATTR encoderISR();


// ============================================================================
// SETUP
// ============================================================================

void setup() {
    // Initialize serial communication
    #if DEBUG_MODE
    Serial.begin(DEBUG_BAUD_RATE);
    while (!Serial && millis() < 3000); // Wait up to 3 seconds for serial
    Serial.println("\n\n=================================");
    Serial.println("ESP32 Walker Monitoring System");
    Serial.println("Firmware Version: " + String(FIRMWARE_VERSION));
    Serial.println("=================================\n");
    #endif

    // Initialize status LED
    pinMode(LED_STATUS_PIN, OUTPUT);
    digitalWrite(LED_STATUS_PIN, HIGH);

    // Initialize button pin if used
    pinMode(ENCODER_PIN_BTN, INPUT_PULLUP);

    // Initialize SPIFFS
    setupStorage();

    // Initialize load cells
    setupLoadCells();

    // Initialize rotary encoder
    setupEncoder();

    // Initialize display
    #if ENABLE_DISPLAY
    setupDisplay();
    displayStatus("Initializing...");
    #endif

    // Connect to WiFi
    setupWiFi();

    // Sync time with NTP
    if (wifiConnected) {
        syncTime();
    }

    // Load today's stats
    // In a full implementation, we'd load from persistent storage
    todayTotalDistance = 0.0f;
    todaySessionCount = 0;

    // System ready
    currentState = STATE_IDLE;
    lastActivityMillis = millis();

    #if DEBUG_MODE
    Serial.println("System initialization complete!");
    Serial.println("Ready to monitor walker usage.\n");
    #endif

    digitalWrite(LED_STATUS_PIN, LOW);
}


// ============================================================================
// MAIN LOOP
// ============================================================================

void loop() {
    unsigned long currentMillis = millis();

    // Read load cells continuously
    readLoadCells();

    // Check for calibration button press
    checkEncoderButton();

    // Handle calibration mode
    if (calibrationMode) {
        performCalibration();
        return; // Skip normal operation during calibration
    }

    // Determine if walker is in use based on weight threshold
    float threshold = USE_METRIC_UNITS ? WEIGHT_THRESHOLD_KG : WEIGHT_THRESHOLD_LBS;
    bool weightDetected = currentTotalWeight > threshold;

    // State machine
    switch (currentState) {
        case STATE_IDLE:
            if (weightDetected) {
                // Weight detected, start session after delay
                if (lastWeightDetectedMillis == 0) {
                    lastWeightDetectedMillis = currentMillis;
                } else if (currentMillis - lastWeightDetectedMillis > SESSION_START_DELAY) {
                    startSession();
                    currentState = STATE_IN_USE;
                }
            } else {
                lastWeightDetectedMillis = 0;
            }

            // Check for sleep mode
            #if ENABLE_DEEP_SLEEP
            if (currentMillis - lastActivityMillis > (IDLE_TIMEOUT_MINUTES * 60000UL)) {
                enterDeepSleep();
            }
            #endif
            break;

        case STATE_IN_USE:
            if (weightDetected) {
                // Continue session
                updateSession();
                lastWeightDetectedMillis = currentMillis;
            } else {
                // No weight detected
                if (currentMillis - lastWeightDetectedMillis > SESSION_END_TIMEOUT) {
                    endSession();
                    currentState = STATE_IDLE;
                }
            }
            break;

        case STATE_UPLOADING:
            // Upload handled synchronously, should return to IDLE quickly
            currentState = STATE_IDLE;
            break;
    }

    // Update display periodically
    #if ENABLE_DISPLAY
    if (currentMillis - lastDisplayUpdate > DISPLAY_UPDATE_RATE) {
        updateDisplay();
        lastDisplayUpdate = currentMillis;
    }
    #endif

    // Check battery status
    #if BATTERY_ENABLE
    if (currentMillis % 60000 == 0) { // Check every minute
        checkBattery();
    }
    #endif

    // Update NTP time periodically
    if (wifiConnected) {
        timeClient.update();
    }

    // Small delay to prevent watchdog issues
    delay(10);
}


// ============================================================================
// WIFI FUNCTIONS
// ============================================================================

void setupWiFi() {
    #if DEBUG_MODE
    Serial.println("Connecting to WiFi...");
    Serial.print("SSID: ");
    Serial.println(WIFI_SSID);
    #endif

    WiFi.mode(WIFI_STA);
    WiFi.setHostname(HOSTNAME);

    connectWiFi();
}

void connectWiFi() {
    if (wifiConnected) return;

    unsigned long startAttempt = millis();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED &&
           millis() - startAttempt < WIFI_TIMEOUT_MS) {
        delay(500);
        #if DEBUG_MODE
        Serial.print(".");
        #endif
    }

    if (WiFi.status() == WL_CONNECTED) {
        wifiConnected = true;
        wifiRetryCount = 0;
        #if DEBUG_MODE
        Serial.println("\nWiFi connected!");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
        #endif

        #if ENABLE_DISPLAY
        displayStatus("WiFi OK");
        delay(1000);
        #endif
    } else {
        wifiConnected = false;
        wifiRetryCount++;
        #if DEBUG_MODE
        Serial.println("\nWiFi connection failed!");
        #endif

        #if ENABLE_DISPLAY
        displayStatus("WiFi Failed");
        delay(1000);
        #endif
    }

    lastWifiAttempt = millis();
}


// ============================================================================
// LOAD CELL FUNCTIONS
// ============================================================================

void setupLoadCells() {
    #if DEBUG_MODE
    Serial.println("Initializing load cells...");
    #endif

    // Initialize HX711 modules
    loadcell1.begin(HX711_1_DOUT_PIN, HX711_1_SCK_PIN);
    loadcell2.begin(HX711_2_DOUT_PIN, HX711_2_SCK_PIN);

    // Set calibration factors
    loadcell1.set_scale(LOADCELL_1_CALIBRATION);
    loadcell2.set_scale(LOADCELL_2_CALIBRATION);

    // Tare the scales (zero them)
    #if DEBUG_MODE
    Serial.println("Taring load cells... Please ensure no weight is applied.");
    #endif

    delay(HX711_STABILIZING_TIME);
    loadcell1.tare(HX711_READ_TIMES);
    loadcell2.tare(HX711_READ_TIMES);

    #if DEBUG_MODE
    Serial.println("Load cells initialized and tared.");
    #endif
}

void readLoadCells() {
    // Read both load cells
    if (loadcell1.is_ready() && loadcell2.is_ready()) {
        currentWeight1 = loadcell1.get_units(3); // Average of 3 readings
        currentWeight2 = loadcell2.get_units(3);

        // Ensure non-negative values
        currentWeight1 = max(0.0f, currentWeight1);
        currentWeight2 = max(0.0f, currentWeight2);

        // Calculate total weight
        currentTotalWeight = currentWeight1 + currentWeight2;

        #if LOG_LOADCELL_VALUES && DEBUG_MODE
        Serial.print("Load Cell 1: ");
        Serial.print(currentWeight1, 2);
        Serial.print(" | Load Cell 2: ");
        Serial.print(currentWeight2, 2);
        Serial.print(" | Total: ");
        Serial.println(currentTotalWeight, 2);
        #endif
    }
}


// ============================================================================
// ENCODER FUNCTIONS
// ============================================================================

void setupEncoder() {
    #if DEBUG_MODE
    Serial.println("Initializing rotary encoder...");
    #endif

    pinMode(ENCODER_PIN_A, INPUT_PULLUP);
    pinMode(ENCODER_PIN_B, INPUT_PULLUP);

    // Attach interrupt to encoder A pin
    attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_A), encoderISR, CHANGE);
    attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_B), encoderISR, CHANGE);

    encoderPosition = 0;
    lastEncoderPosition = 0;

    #if DEBUG_MODE
    Serial.println("Encoder initialized.");
    #endif
}

void IRAM_ATTR encoderISR() {
    unsigned long currentTime = millis();

    // Debounce
    if (currentTime - lastEncoderTime < ENCODER_DEBOUNCE_MS) {
        return;
    }

    lastEncoderTime = currentTime;

    // Read current state
    int stateA = digitalRead(ENCODER_PIN_A);
    int stateB = digitalRead(ENCODER_PIN_B);

    // Determine direction (quadrature encoding)
    if (stateA == stateB) {
        encoderPosition++;
    } else {
        encoderPosition--;
    }
}

void checkEncoderButton() {
    // Check if encoder button is pressed (for calibration mode)
    static unsigned long buttonPressTime = 0;
    static bool buttonPressed = false;

    if (digitalRead(ENCODER_PIN_BTN) == LOW) {
        if (!buttonPressed) {
            buttonPressed = true;
            buttonPressTime = millis();
        } else {
            // Check for long press (3 seconds) to enter calibration
            if (millis() - buttonPressTime > 3000 && !calibrationMode) {
                enterCalibrationMode();
            }
        }
    } else {
        buttonPressed = false;
    }
}


// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

void startSession() {
    #if DEBUG_MODE
    Serial.println("\n=== SESSION STARTED ===");
    #endif

    sessionActive = true;
    sessionStartMillis = millis();
    lastEncoderPosition = encoderPosition;

    // Initialize session data
    currentSession.startTime = timeClient.getEpochTime();
    currentSession.distanceCm = 0.0f;
    currentSession.avgWeightLb = 0.0f;
    currentSession.maxWeightLb = 0.0f;
    currentSession.uploaded = false;

    weightSumForAverage = 0.0f;
    weightSampleCount = 0;

    lastActivityMillis = millis();

    #if ENABLE_DISPLAY
    displayStatus("Session Active");
    #endif
}

void updateSession() {
    if (!sessionActive) return;

    // Calculate distance traveled
    long encoderDelta = encoderPosition - lastEncoderPosition;
    float distanceDelta = abs(encoderDelta) * DISTANCE_CALIBRATION;
    currentSession.distanceCm += distanceDelta;
    lastEncoderPosition = encoderPosition;

    // Update weight statistics
    weightSumForAverage += currentTotalWeight;
    weightSampleCount++;

    if (currentTotalWeight > currentSession.maxWeightLb) {
        currentSession.maxWeightLb = currentTotalWeight;
    }

    #if LOG_ENCODER_VALUES && DEBUG_MODE
    if (encoderDelta != 0) {
        Serial.print("Distance traveled: ");
        Serial.print(currentSession.distanceCm);
        Serial.println(" cm");
    }
    #endif

    lastActivityMillis = millis();
}

void endSession() {
    if (!sessionActive) return;

    #if DEBUG_MODE
    Serial.println("\n=== SESSION ENDED ===");
    #endif

    // Finalize session data
    currentSession.endTime = timeClient.getEpochTime();
    currentSession.duration = (millis() - sessionStartMillis) / 1000; // Convert to seconds

    // Calculate average weight
    if (weightSampleCount > 0) {
        currentSession.avgWeightLb = weightSumForAverage / weightSampleCount;
    }

    // Only save if session met minimum duration
    if ((millis() - sessionStartMillis) >= MIN_SESSION_DURATION) {
        #if DEBUG_MODE
        Serial.println("Session Summary:");
        Serial.print("  Duration: ");
        Serial.print(currentSession.duration);
        Serial.println(" seconds");
        Serial.print("  Distance: ");
        Serial.print(currentSession.distanceCm);
        Serial.println(" cm");
        Serial.print("  Avg Weight: ");
        Serial.print(currentSession.avgWeightLb);
        Serial.println(" lbs");
        Serial.print("  Max Weight: ");
        Serial.print(currentSession.maxWeightLb);
        Serial.println(" lbs");
        #endif

        // Save session to storage
        saveSession(currentSession);

        // Update daily totals
        todayTotalDistance += currentSession.distanceCm;
        todaySessionCount++;

        // Try to upload if connected
        if (wifiConnected && storedSessionCount >= AUTO_UPLOAD_THRESHOLD) {
            uploadSessions();
        }
    } else {
        #if DEBUG_MODE
        Serial.println("Session too short, not saving.");
        #endif
    }

    sessionActive = false;
    lastActivityMillis = millis();

    #if ENABLE_DISPLAY
    displayStatus("Session Saved");
    delay(2000);
    #endif
}


// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

void setupStorage() {
    #if DEBUG_MODE
    Serial.println("Initializing SPIFFS...");
    #endif

    if (!SPIFFS.begin(true)) {
        #if DEBUG_MODE
        Serial.println("SPIFFS initialization failed!");
        #endif
        return;
    }

    #if DEBUG_MODE
    Serial.println("SPIFFS initialized successfully.");
    Serial.print("Total space: ");
    Serial.println(SPIFFS.totalBytes());
    Serial.print("Used space: ");
    Serial.println(SPIFFS.usedBytes());
    #endif

    // Count existing sessions
    File file = SPIFFS.open(SESSION_FILE_PATH, "r");
    if (file) {
        DynamicJsonDocument doc(8192);
        DeserializationError error = deserializeJson(doc, file);
        file.close();

        if (!error) {
            storedSessionCount = doc["sessions"].size();
            #if DEBUG_MODE
            Serial.print("Found ");
            Serial.print(storedSessionCount);
            Serial.println(" stored sessions.");
            #endif
        }
    }
}

void saveSession(Session &session) {
    #if DEBUG_MODE
    Serial.println("Saving session to SPIFFS...");
    #endif

    // Read existing sessions
    DynamicJsonDocument doc(16384);

    File file = SPIFFS.open(SESSION_FILE_PATH, "r");
    if (file) {
        deserializeJson(doc, file);
        file.close();
    }

    // Add new session
    JsonArray sessions = doc["sessions"].isNull() ? doc.createNestedArray("sessions") : doc["sessions"];

    JsonObject sessionObj = sessions.createNestedObject();
    sessionObj["startTime"] = session.startTime;
    sessionObj["endTime"] = session.endTime;
    sessionObj["duration"] = session.duration;
    sessionObj["distanceCm"] = session.distanceCm;
    sessionObj["avgWeightLb"] = session.avgWeightLb;
    sessionObj["maxWeightLb"] = session.maxWeightLb;
    sessionObj["uploaded"] = session.uploaded;
    sessionObj["deviceId"] = DEVICE_ID;

    // Save back to file
    file = SPIFFS.open(SESSION_FILE_PATH, "w");
    if (file) {
        serializeJson(doc, file);
        file.close();
        storedSessionCount++;

        #if DEBUG_MODE
        Serial.println("Session saved successfully.");
        Serial.print("Total stored sessions: ");
        Serial.println(storedSessionCount);
        #endif
    } else {
        #if DEBUG_MODE
        Serial.println("Failed to save session!");
        #endif
    }
}

void uploadSessions() {
    if (!wifiConnected) {
        #if DEBUG_MODE
        Serial.println("Cannot upload: WiFi not connected");
        #endif
        return;
    }

    currentState = STATE_UPLOADING;

    #if DEBUG_MODE
    Serial.println("Uploading sessions to server...");
    #endif

    #if ENABLE_DISPLAY
    displayStatus("Uploading...");
    #endif

    // Read sessions from file
    File file = SPIFFS.open(SESSION_FILE_PATH, "r");
    if (!file) {
        #if DEBUG_MODE
        Serial.println("No sessions file found.");
        #endif
        return;
    }

    DynamicJsonDocument doc(16384);
    DeserializationError error = deserializeJson(doc, file);
    file.close();

    if (error) {
        #if DEBUG_MODE
        Serial.println("Failed to parse sessions file!");
        #endif
        return;
    }

    JsonArray sessions = doc["sessions"];
    int uploadedCount = 0;

    // Upload each session
    for (JsonObject sessionObj : sessions) {
        if (!sessionObj["uploaded"].as<bool>()) {
            HTTPClient http;
            http.begin(API_ENDPOINT);
            http.addHeader("Content-Type", "application/json");
            http.setTimeout(API_TIMEOUT_MS);

            String jsonPayload;
            serializeJson(sessionObj, jsonPayload);

            int httpCode = http.POST(jsonPayload);

            if (httpCode == 200 || httpCode == 201) {
                sessionObj["uploaded"] = true;
                uploadedCount++;

                #if DEBUG_MODE
                Serial.print("Session uploaded successfully. HTTP code: ");
                Serial.println(httpCode);
                #endif
            } else {
                #if DEBUG_MODE
                Serial.print("Upload failed. HTTP code: ");
                Serial.println(httpCode);
                #endif
            }

            http.end();
        }
    }

    // Save updated file with upload status
    file = SPIFFS.open(SESSION_FILE_PATH, "w");
    if (file) {
        serializeJson(doc, file);
        file.close();
    }

    #if DEBUG_MODE
    Serial.print("Uploaded ");
    Serial.print(uploadedCount);
    Serial.println(" sessions.");
    #endif

    #if ENABLE_DISPLAY
    displayStatus("Upload Complete");
    delay(2000);
    #endif
}


// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

#if ENABLE_DISPLAY
void setupDisplay() {
    #if DEBUG_MODE
    Serial.println("Initializing OLED display...");
    #endif

    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
        #if DEBUG_MODE
        Serial.println("OLED initialization failed!");
        #endif
        return;
    }

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("Walker Monitor");
    display.println("v" + String(FIRMWARE_VERSION));
    display.display();

    delay(2000);

    #if DEBUG_MODE
    Serial.println("Display initialized.");
    #endif
}

void updateDisplay() {
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);

    // Show current state
    if (sessionActive) {
        display.setTextSize(2);
        display.println("IN USE");

        display.setTextSize(1);
        unsigned long sessionDuration = (millis() - sessionStartMillis) / 1000;
        display.print("Time: ");
        display.print(sessionDuration / 60);
        display.print(":");
        display.println(sessionDuration % 60);

        display.print("Dist: ");
        if (USE_METRIC_UNITS) {
            display.print(cmToMeters(currentSession.distanceCm), 1);
            display.println(" m");
        } else {
            display.print(cmToFeet(currentSession.distanceCm), 1);
            display.println(" ft");
        }

        display.print("Weight: ");
        if (USE_METRIC_UNITS) {
            display.print(lbsToKg(currentTotalWeight), 1);
            display.println(" kg");
        } else {
            display.print(currentTotalWeight, 1);
            display.println(" lbs");
        }
    } else {
        display.println("READY");
        display.println("");
        display.print("Today: ");
        display.print(todaySessionCount);
        display.println(" trips");

        display.print("Distance: ");
        if (USE_METRIC_UNITS) {
            display.print(cmToMeters(todayTotalDistance), 1);
            display.println(" m");
        } else {
            display.print(cmToFeet(todayTotalDistance), 1);
            display.println(" ft");
        }

        display.println("");
        display.print("Stored: ");
        display.println(storedSessionCount);

        // WiFi status
        if (wifiConnected) {
            display.println("WiFi: OK");
        } else {
            display.println("WiFi: --");
        }
    }

    display.display();
}

void displayStatus(String status) {
    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(0, 20);
    display.println(status);
    display.display();
}
#endif


// ============================================================================
// CALIBRATION FUNCTIONS
// ============================================================================

void enterCalibrationMode() {
    calibrationMode = true;
    calibrationStartTime = millis();

    #if DEBUG_MODE
    Serial.println("\n=== ENTERING CALIBRATION MODE ===");
    Serial.println("1. Remove all weight from walker");
    Serial.println("2. Press button to tare");
    Serial.println("3. Place known weight (e.g., 20 lbs)");
    Serial.println("4. Press button to calibrate");
    Serial.println("5. Long press to exit");
    #endif

    #if ENABLE_DISPLAY
    displayStatus("CALIBRATE");
    delay(2000);
    #endif
}

void performCalibration() {
    // Simple calibration routine
    // In production, this would be more sophisticated

    static int calibrationStep = 0;
    static bool buttonWasPressed = false;
    bool buttonPressed = (digitalRead(ENCODER_PIN_BTN) == LOW);

    if (buttonPressed && !buttonWasPressed) {
        // Button just pressed
        calibrationStep++;

        if (calibrationStep == 1) {
            // Tare
            loadcell1.tare(20);
            loadcell2.tare(20);
            #if DEBUG_MODE
            Serial.println("Scales tared. Place known weight now.");
            #endif
        } else if (calibrationStep == 2) {
            // Calibrate - user should have placed known weight
            // This is simplified - in production, prompt for weight value
            float knownWeight = 20.0f; // Example: 20 lbs
            float reading1 = loadcell1.get_units(10);
            float reading2 = loadcell2.get_units(10);

            #if DEBUG_MODE
            Serial.print("Calibration complete. Readings: ");
            Serial.print(reading1);
            Serial.print(", ");
            Serial.println(reading2);
            Serial.println("Please update calibration factors in config.h");
            #endif

            calibrationMode = false;
            calibrationStep = 0;
        }
    }

    buttonWasPressed = buttonPressed;

    // Exit if calibration takes too long
    if (millis() - calibrationStartTime > 60000) {
        calibrationMode = false;
        calibrationStep = 0;
        #if DEBUG_MODE
        Serial.println("Calibration timeout - exiting.");
        #endif
    }
}


// ============================================================================
// POWER MANAGEMENT
// ============================================================================

void enterDeepSleep() {
    #if DEBUG_MODE
    Serial.println("Entering deep sleep mode...");
    #endif

    #if ENABLE_DISPLAY
    displayStatus("Sleep Mode");
    delay(2000);
    display.clearDisplay();
    display.display();
    #endif

    // Configure wake-up sources
    // Wake on encoder movement (weight applied)
    esp_sleep_enable_ext0_wakeup((gpio_num_t)ENCODER_PIN_A, LOW);

    // Wake on timer
    esp_sleep_enable_timer_wakeup(SLEEP_DURATION_SECONDS * 1000000ULL);

    // Enter deep sleep
    esp_deep_sleep_start();
}

void checkBattery() {
    #if BATTERY_ENABLE
    // Read battery voltage
    int adcValue = analogRead(BATTERY_PIN);
    float voltage = (adcValue / 4095.0) * 3.3 * 2.0; // Assuming voltage divider

    #if DEBUG_MODE && LOG_MEMORY_USAGE
    Serial.print("Battery voltage: ");
    Serial.print(voltage, 2);
    Serial.println(" V");
    #endif

    if (voltage < BATTERY_CRITICAL_VOLTAGE) {
        #if DEBUG_MODE
        Serial.println("CRITICAL BATTERY - Entering sleep mode");
        #endif
        enterDeepSleep();
    } else if (voltage < BATTERY_LOW_VOLTAGE) {
        #if DEBUG_MODE
        Serial.println("WARNING: Low battery");
        #endif
    }
    #endif
}


// ============================================================================
// TIME SYNCHRONIZATION
// ============================================================================

void syncTime() {
    #if DEBUG_MODE
    Serial.println("Synchronizing time with NTP server...");
    #endif

    timeClient.begin();

    int retries = 0;
    while (!timeClient.update() && retries < 5) {
        timeClient.forceUpdate();
        retries++;
        delay(1000);
    }

    if (retries < 5) {
        #if DEBUG_MODE
        Serial.println("Time synchronized successfully.");
        Serial.print("Current time: ");
        Serial.println(timeClient.getFormattedTime());
        #endif
    } else {
        #if DEBUG_MODE
        Serial.println("Failed to synchronize time.");
        #endif
    }
}


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

float lbsToKg(float lbs) {
    return lbs * 0.453592f;
}

float kgToLbs(float kg) {
    return kg * 2.20462f;
}

float cmToFeet(float cm) {
    return cm / 30.48f;
}

float cmToMeters(float cm) {
    return cm / 100.0f;
}
