# Quick Start Guide - ESP32 Walker Monitor

Get your walker monitoring system up and running in 30 minutes!

## 📦 What You Need

- [ ] ESP32 development board
- [ ] 2× HX711 load cell amplifiers
- [ ] 2× 200kg button load cells
- [ ] 1× Rotary encoder with wheel
- [ ] 1× OLED display (128×64, I2C)
- [ ] USB cable for programming
- [ ] Jumper wires
- [ ] Computer with PlatformIO or Arduino IDE

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Wire the Hardware (15 min)

**Load Cells → HX711 → ESP32**

```
Load Cell #1:
  Red    → HX711 E+
  Black  → HX711 E-
  Green  → HX711 A-
  White  → HX711 A+

HX711 #1:
  VCC  → ESP32 3.3V
  GND  → ESP32 GND
  DOUT → ESP32 GPIO16
  SCK  → ESP32 GPIO17

Repeat for Load Cell #2 and HX711 #2 (GPIO18, GPIO19)
```

**Rotary Encoder**
```
CLK → GPIO25
DT  → GPIO26
SW  → GPIO27
+   → 3.3V
GND → GND
```

**OLED Display**
```
VCC → 3.3V
GND → GND
SDA → GPIO21
SCL → GPIO22
```

### Step 2: Install Software (5 min)

**Option A: PlatformIO (Recommended)**
```bash
# Install PlatformIO Core
pip install platformio

# Navigate to firmware folder
cd firmware/

# Install dependencies
pio lib install
```

**Option B: Arduino IDE**
1. Install Arduino IDE
2. Add ESP32 board support (File → Preferences → Board Manager URLs):
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Install libraries (Sketch → Manage Libraries):
   - HX711
   - Adafruit SSD1306
   - Adafruit GFX
   - ArduinoJson
   - NTPClient

### Step 3: Configure WiFi (2 min)

Edit `include/config.h`:

```cpp
// Line 145-146: Update your WiFi credentials
#define WIFI_SSID           "YourWiFiName"
#define WIFI_PASSWORD       "YourPassword"

// Line 154: Update your API endpoint
#define API_ENDPOINT        "https://your-api.com/api/walker/sessions"
```

### Step 4: Upload Firmware (3 min)

**PlatformIO:**
```bash
pio run --target upload
```

**Arduino IDE:**
1. Tools → Board → ESP32 Dev Module
2. Tools → Port → (select your port)
3. Click Upload button

### Step 5: Test & Calibrate (5 min)

1. **Open Serial Monitor** (115200 baud)
2. **Verify boot**: Should see "System initialization complete!"
3. **Test load cells**: Apply weight, watch readings
4. **Test encoder**: Rotate wheel, watch distance change
5. **Calibrate** (see below)

---

## 🎯 Calibration (Simple Method)

### Load Cell Calibration

1. **Remove all weight** from walker
2. Press and hold encoder button for 3 seconds
3. When prompted, press button again to tare
4. **Place known weight** (e.g., 20 lbs / 10 kg)
5. Press button to complete
6. Note the calibration factor in serial output
7. Update `config.h`:
   ```cpp
   #define LOADCELL_1_CALIBRATION  -7050.0f  // Your value here
   #define LOADCELL_2_CALIBRATION  -7050.0f  // Your value here
   ```
8. Re-upload firmware

### Distance Calibration

1. **Measure wheel circumference** (in cm)
   - Tape measure around the wheel
   - Or: Diameter × 3.14159

2. **Check encoder spec** for pulses per revolution
   - Usually 20 or 24 for common rotary encoders

3. Update `config.h`:
   ```cpp
   #define WHEEL_CIRCUMFERENCE_CM  50.0f     // Your measurement
   #define ENCODER_PULSES_PER_REV  20        // Your encoder spec
   ```

---

## 📊 Testing Your Setup

### Visual Test Checklist

```
✓ Power LED on ESP32 is lit
✓ OLED display shows "READY"
✓ Serial monitor shows no errors
✓ WiFi connected (check display)
✓ Apply 20+ lbs weight → Display shows "IN USE"
✓ Remove weight → Session ends, "READY" returns
✓ Rotate encoder → Distance increases
```

### Serial Output Test

```
=== Expected Output ===
ESP32 Walker Monitoring System
Firmware Version: 1.0.0
Initializing SPIFFS...
Initializing load cells...
Initializing rotary encoder...
Initializing OLED display...
Connecting to WiFi...
WiFi connected!
IP address: 192.168.1.xxx
System initialization complete!
```

---

## 🔧 Common Issues (Quick Fixes)

| Problem | Quick Fix |
|---------|-----------|
| Load cells read 0 or negative | Swap A+ and A- wires |
| Display is blank | Check I2C address (try 0x3D instead of 0x3C) |
| WiFi won't connect | Verify SSID/password, try phone hotspot |
| Encoder not counting | Check A and B are not swapped |
| Random resets | Add 10µF capacitor between 3.3V and GND |
| Compile errors | Update all libraries to latest versions |

---

## 📱 Monitor Operation

### Normal Usage Flow

1. **System boots** → Auto-tares load cells → Shows "READY"
2. **User grabs walker** → Weight detected (2 sec delay) → "IN USE"
3. **User walks** → Distance tracked → Weight averaged
4. **User releases walker** → 5 sec timeout → Session saved
5. **Data uploads** → Automatic when 50 sessions stored

### Display Modes

**Idle Screen:**
```
READY
Today: 3 trips
Distance: 125 ft
Stored: 8
WiFi: OK
```

**Active Session:**
```
IN USE
Time: 1:23
Dist: 42.5 ft
Weight: 48.2 lbs
```

---

## 🔋 Battery Tips

**For longest battery life:**
- Enable deep sleep: `#define ENABLE_DEEP_SLEEP true`
- Use 3000mAh+ LiPo battery
- Disable display when not needed
- Reduce WiFi connection attempts

**Expected battery life:**
- With sleep mode: 48-72 hours
- Without sleep mode: 12-24 hours
- Active use: 6-8 hours continuous

---

## 📡 API Integration

Your server should accept POST requests:

**Endpoint:** `POST /api/walker/sessions`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "startTime": 1699920000,
  "endTime": 1699920300,
  "duration": 300,
  "distanceCm": 1524.5,
  "avgWeightLb": 45.2,
  "maxWeightLb": 52.1,
  "deviceId": "ESP32-001"
}
```

**Response:**
- Return `200` or `201` for success
- Any other code triggers retry

---

## 🎛️ Key Settings Reference

Quick access to common configuration values in `config.h`:

```cpp
// Detection Threshold
#define WEIGHT_THRESHOLD_LBS    20.0f     // Adjust sensitivity

// Session Timing
#define SESSION_START_DELAY     2000      // ms before starting
#define SESSION_END_TIMEOUT     5000      // ms no weight = end
#define MIN_SESSION_DURATION    3000      // min time to log

// Display
#define ENABLE_DISPLAY          true      // Enable/disable OLED
#define DISPLAY_UPDATE_RATE     500       // ms refresh rate

// Power
#define ENABLE_DEEP_SLEEP       true      // Battery saving
#define IDLE_TIMEOUT_MINUTES    10        // Before sleep

// Storage
#define MAX_SESSIONS_STORED     100       // Local storage limit
#define AUTO_UPLOAD_THRESHOLD   50        // Auto-upload trigger

// Units
#define USE_METRIC_UNITS        false     // false=lbs/ft, true=kg/m
```

---

## 📞 Need Help?

1. **Check README.md** for detailed documentation
2. **Serial Monitor** shows detailed debug info
3. **Test incrementally** - one component at a time
4. **Verify wiring** against pin configuration
5. **Check power supply** - needs stable 500mA+

---

## ✅ Success Checklist

Before deploying to walker:

- [ ] Load cells accurately measure weight (±1 lb)
- [ ] Distance tracking works (rotate wheel test)
- [ ] Sessions are saved (check serial output)
- [ ] WiFi connects reliably
- [ ] Display shows correct information
- [ ] Battery lasts expected duration
- [ ] API uploads work (test endpoint)
- [ ] Calibration values are saved
- [ ] Sleep mode activates when idle
- [ ] Secured safely to walker frame

---

## 🚀 Next Steps

Once basic system works:

1. **Fine-tune thresholds** for your specific use case
2. **Test battery life** with typical usage patterns
3. **Set up backend** to receive and analyze data
4. **Create alerts** for mobility pattern changes
5. **Add analytics** for trend detection
6. **Document baseline** for comparison

---

## 📝 Quick Commands

```bash
# Build only
pio run

# Upload
pio run --target upload

# Serial monitor
pio device monitor

# Clean build
pio run --target clean

# Upload filesystem (if using SPIFFS data)
pio run --target uploadfs
```

---

**You're ready to go! 🎉**

For detailed information, see the full [README.md](README.md).
