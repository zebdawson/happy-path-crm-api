/**
 * Configuration file for ESP32 Walker Monitoring System
 *
 * This file contains all pin definitions, calibration values,
 * and system settings. Modify these values to match your hardware setup.
 */

#ifndef CONFIG_H
#define CONFIG_H

// ============================================================================
// PIN DEFINITIONS
// ============================================================================

// HX711 Load Cell Amplifier #1 (Left/Front)
#define HX711_1_DOUT_PIN    16    // Data output pin
#define HX711_1_SCK_PIN     17    // Clock pin

// HX711 Load Cell Amplifier #2 (Right/Rear)
#define HX711_2_DOUT_PIN    18    // Data output pin
#define HX711_2_SCK_PIN     19    // Clock pin

// Rotary Encoder (Distance Measurement)
#define ENCODER_PIN_A       25    // Encoder A phase
#define ENCODER_PIN_B       26    // Encoder B phase
#define ENCODER_PIN_BTN     27    // Encoder button (optional, for calibration)

// OLED Display (I2C)
#define OLED_SDA_PIN        21    // I2C Data (standard ESP32 I2C)
#define OLED_SCL_PIN        22    // I2C Clock (standard ESP32 I2C)
#define OLED_ADDR           0x3C  // I2C address (0x3C or 0x3D)
#define SCREEN_WIDTH        128   // OLED display width in pixels
#define SCREEN_HEIGHT       64    // OLED display height in pixels

// LED Indicators (optional)
#define LED_STATUS_PIN      2     // Built-in LED for status indication
#define LED_WIFI_PIN        4     // External LED for WiFi status (optional)

// Battery Monitoring
#define BATTERY_PIN         35    // ADC pin for battery voltage monitoring
#define BATTERY_ENABLE      true  // Enable battery monitoring


// ============================================================================
// CALIBRATION VALUES
// ============================================================================

// Load Cell Calibration Factors (adjust after calibration)
// To calibrate: Place known weight and adjust these values
#define LOADCELL_1_CALIBRATION  -7050.0f  // Typical HX711 calibration factor
#define LOADCELL_2_CALIBRATION  -7050.0f  // Adjust independently for each sensor

// Load Cell Offset/Tare Values (set to 0, will be calibrated at startup)
#define LOADCELL_1_OFFSET       0
#define LOADCELL_2_OFFSET       0

// Distance Calibration
#define WHEEL_CIRCUMFERENCE_CM  50.0f     // Wheel circumference in centimeters
#define ENCODER_PULSES_PER_REV  20        // Pulses per revolution for your encoder
#define DISTANCE_CALIBRATION    (WHEEL_CIRCUMFERENCE_CM / ENCODER_PULSES_PER_REV)

// Unit Preferences
#define USE_METRIC_UNITS    false  // false = Imperial (lbs, ft), true = Metric (kg, m)


// ============================================================================
// SYSTEM THRESHOLDS AND SETTINGS
// ============================================================================

// Weight Threshold for "In Use" Detection
#define WEIGHT_THRESHOLD_LBS    20.0f     // Minimum combined weight (lbs) to detect usage
#define WEIGHT_THRESHOLD_KG     9.07f     // Equivalent in kg

// Session Detection Settings
#define SESSION_START_DELAY     2000      // Delay (ms) before starting session
#define SESSION_END_TIMEOUT     5000      // Timeout (ms) of no weight to end session
#define MIN_SESSION_DURATION    3000      // Minimum session duration (ms) to log

// Sampling Rates
#define LOADCELL_SAMPLE_RATE    10        // Hz - how often to read load cells
#define ENCODER_DEBOUNCE_MS     5         // Debounce time for encoder
#define DISPLAY_UPDATE_RATE     500       // ms - how often to update display

// Data Storage
#define MAX_SESSIONS_STORED     100       // Maximum sessions in SPIFFS before upload required
#define AUTO_UPLOAD_THRESHOLD   50        // Auto-upload when this many sessions accumulated
#define SESSION_FILE_PATH       "/sessions.json"
#define CONFIG_FILE_PATH        "/config.json"


// ============================================================================
// WIFI AND NETWORKING
// ============================================================================

// WiFi Settings (override in wifi_config.h or through web interface)
#define WIFI_SSID           "YOUR_WIFI_SSID"
#define WIFI_PASSWORD       "YOUR_WIFI_PASSWORD"
#define WIFI_TIMEOUT_MS     20000         // WiFi connection timeout

// HTTP API Endpoint
#define API_ENDPOINT        "https://your-api-endpoint.com/api/walker/sessions"
#define API_TIMEOUT_MS      10000         // HTTP request timeout
#define API_RETRY_COUNT     3             // Number of retries for failed uploads

// NTP Time Synchronization
#define NTP_SERVER          "pool.ntp.org"
#define NTP_OFFSET_SECONDS  0             // Timezone offset (0 for UTC)
#define NTP_UPDATE_INTERVAL 3600000       // Update time every hour


// ============================================================================
// POWER MANAGEMENT
// ============================================================================

// Deep Sleep Settings
#define ENABLE_DEEP_SLEEP       true      // Enable deep sleep mode
#define IDLE_TIMEOUT_MINUTES    10        // Minutes of inactivity before sleep
#define SLEEP_DURATION_SECONDS  60        // Wake up every N seconds to check for activity

// Battery Thresholds
#define BATTERY_LOW_VOLTAGE     3.3f      // Voltage threshold for low battery warning
#define BATTERY_CRITICAL_VOLTAGE 3.0f     // Critical voltage - force sleep/shutdown


// ============================================================================
// DISPLAY SETTINGS
// ============================================================================

#define ENABLE_DISPLAY      true          // Enable/disable OLED display
#define DISPLAY_ROTATION    0             // 0, 1, 2, or 3 for rotation
#define DISPLAY_CONTRAST    128           // 0-255, lower = dimmer
#define SCREEN_SAVER_MIN    5             // Turn off display after N minutes idle


// ============================================================================
// DEBUG AND LOGGING
// ============================================================================

#define DEBUG_MODE          true          // Enable serial debug output
#define DEBUG_BAUD_RATE     115200        // Serial baud rate
#define LOG_LOADCELL_VALUES false         // Log raw load cell readings
#define LOG_ENCODER_VALUES  false         // Log encoder pulse counts
#define LOG_MEMORY_USAGE    true          // Log free heap memory


// ============================================================================
// SYSTEM INFO
// ============================================================================

#define FIRMWARE_VERSION    "1.0.0"
#define DEVICE_NAME         "Walker-Monitor"
#define DEVICE_ID           "ESP32-001"   // Unique device identifier


// ============================================================================
// ADVANCED SETTINGS (typically don't need to change)
// ============================================================================

// HX711 Settings
#define HX711_STABILIZING_TIME  2000      // Time to wait for HX711 to stabilize (ms)
#define HX711_READ_TIMES        10        // Number of readings to average

// Encoder Settings
#define ENCODER_TYPE            0         // 0 = standard quadrature, 1 = single phase

// WiFi Advanced
#define WIFI_MAX_RECONNECT      5         // Max reconnection attempts
#define HOSTNAME                DEVICE_NAME

// Web Server (for configuration interface)
#define ENABLE_WEB_SERVER       false     // Enable web configuration interface
#define WEB_SERVER_PORT         80


#endif // CONFIG_H
