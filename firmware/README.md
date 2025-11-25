# ESP32 Walker Monitoring System - Firmware

A comprehensive firmware solution for tracking walker usage patterns using an ESP32 microcontroller. This system monitors weight distribution, distance traveled, and session duration to help detect declining mobility patterns.

## Features

- **Dual Load Cell Monitoring**: Tracks weight distribution across two 200kg button load cells
- **Distance Tracking**: Rotary encoder-based distance measurement
- **Session Logging**: Automatic detection and recording of walker usage sessions
- **Local Storage**: SPIFFS-based storage for up to 100 sessions
- **Cloud Sync**: HTTP endpoint integration for data upload
- **OLED Display**: Real-time status and statistics display (optional)
- **Power Management**: Deep sleep mode for battery conservation
- **Calibration Mode**: Built-in calibration for load cells and distance measurement

---

## Hardware Requirements

### Core Components

| Component | Specification | Quantity |
|-----------|--------------|----------|
| ESP32 Development Board | Any ESP32 board (ESP32-DevKitC, etc.) | 1 |
| HX711 Load Cell Amplifier | 24-bit ADC for load cells | 2 |
| Button Load Cell | 200kg capacity (half-bridge) | 2 |
| Rotary Encoder | Quadrature encoder with wheel | 1 |
| OLED Display | 128x64 I2C (SSD1306) | 1 (optional) |
| Rechargeable Battery | 3.7V LiPo (2000mAh+ recommended) | 1 |
| Battery Protection Circuit | TP4056 or similar | 1 |

### Recommended Accessories

- Enclosure for ESP32 and electronics
- Mounting hardware for load cells
- Wire (22-26 AWG recommended)
- Heat shrink tubing
- Power switch

---

## Pin Configuration

The default pin configuration is defined in `include/config.h`. You can modify these to match your hardware setup.

### Default Pin Assignments

```
Component              | ESP32 Pin | Description
----------------------|-----------|----------------------------------
HX711 #1 DOUT         | GPIO 16   | Load cell amplifier #1 data
HX711 #1 SCK          | GPIO 17   | Load cell amplifier #1 clock
HX711 #2 DOUT         | GPIO 18   | Load cell amplifier #2 data
HX711 #2 SCK          | GPIO 19   | Load cell amplifier #2 clock
Encoder A Phase       | GPIO 25   | Rotary encoder A signal
Encoder B Phase       | GPIO 26   | Rotary encoder B signal
Encoder Button        | GPIO 27   | Calibration button (optional)
OLED SDA              | GPIO 21   | I2C data (standard)
OLED SCL              | GPIO 22   | I2C clock (standard)
Status LED            | GPIO 2    | Built-in LED
Battery Monitor       | GPIO 35   | ADC for battery voltage
```

### Wiring Diagrams

#### HX711 Load Cell Connection

```
Load Cell (200kg)          HX711 Module           ESP32
┌─────────────┐           ┌──────────┐           ┌──────┐
│  Red  (E+)  ├───────────┤ E+       │           │      │
│  Black (E-) ├───────────┤ E-       │           │      │
│  Green (A-) ├───────────┤ A-       │           │      │
│  White (A+) ├───────────┤ A+       │           │      │
└─────────────┘           │          │           │      │
                          │ VCC      ├───────────┤ 3.3V │
                          │ GND      ├───────────┤ GND  │
                          │ DOUT     ├───────────┤ GPIO │
                          │ SCK      ├───────────┤ GPIO │
                          └──────────┘           └──────┘
```

#### Rotary Encoder Connection

```
Rotary Encoder            ESP32
┌──────────┐             ┌──────┐
│ CLK (A)  ├─────────────┤ GPIO 25
│ DT  (B)  ├─────────────┤ GPIO 26
│ SW       ├─────────────┤ GPIO 27
│ +        ├─────────────┤ 3.3V
│ GND      ├─────────────┤ GND
└──────────┘             └──────┘
```

#### OLED Display Connection (I2C)

```
OLED Display              ESP32
┌──────────┐             ┌──────┐
│ VCC      ├─────────────┤ 3.3V
│ GND      ├─────────────┤ GND
│ SDA      ├─────────────┤ GPIO 21
│ SCL      ├─────────────┤ GPIO 22
└──────────┘             └──────┘
```

---

## Software Setup

### Prerequisites

1. **PlatformIO** (recommended) or **Arduino IDE**
   - [Install PlatformIO](https://platformio.org/install)
   - Or [Install Arduino IDE](https://www.arduino.cc/en/software)

2. **USB Driver** for ESP32
   - CP2102 or CH340 driver depending on your board

### Installation Steps

#### Option 1: PlatformIO (Recommended)

1. **Clone or download this firmware**
   ```bash
   cd firmware/
   ```

2. **Install dependencies**
   ```bash
   pio lib install
   ```

3. **Configure WiFi and API settings**
   - Open `include/config.h`
   - Update `WIFI_SSID` and `WIFI_PASSWORD`
   - Update `API_ENDPOINT` with your server URL
   - Adjust pin assignments if needed

4. **Build the firmware**
   ```bash
   pio run
   ```

5. **Upload to ESP32**
   ```bash
   pio run --target upload
   ```

6. **Monitor serial output**
   ```bash
   pio device monitor
   ```

#### Option 2: Arduino IDE

1. **Install ESP32 Board Support**
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Board Manager → Search "ESP32" → Install

2. **Install Required Libraries**
   - Sketch → Include Library → Manage Libraries
   - Install the following:
     - HX711 by Bogdan Necula
     - Adafruit SSD1306
     - Adafruit GFX Library
     - ArduinoJson
     - NTPClient

3. **Open the firmware**
   - Rename `src/main.cpp` to `main.ino` (or copy contents)
   - Open in Arduino IDE

4. **Configure settings**
   - Edit `include/config.h` as described above

5. **Select board and port**
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → (select your COM port)

6. **Upload**
   - Click Upload button

---

## Configuration

### WiFi Setup

Edit `include/config.h`:

```cpp
#define WIFI_SSID           "YourNetworkName"
#define WIFI_PASSWORD       "YourPassword"
```

### API Endpoint Configuration

Set your server endpoint:

```cpp
#define API_ENDPOINT        "https://your-api.com/api/walker/sessions"
```

The firmware will POST session data in JSON format:

```json
{
  "startTime": 1699920000,
  "endTime": 1699920300,
  "duration": 300,
  "distanceCm": 1524.5,
  "avgWeightLb": 45.2,
  "maxWeightLb": 52.1,
  "uploaded": false,
  "deviceId": "ESP32-001"
}
```

### Load Cell Calibration

1. **Initial Setup**
   - Ensure no weight is on the walker
   - The system will automatically tare on startup

2. **Finding Calibration Factor**
   - Place a known weight on the walker (e.g., 20 lbs)
   - Monitor serial output for readings
   - Calculate: `calibration_factor = reading / known_weight`
   - Update in `config.h`:
     ```cpp
     #define LOADCELL_1_CALIBRATION  -7050.0f
     #define LOADCELL_2_CALIBRATION  -7050.0f
     ```

3. **Using Calibration Mode**
   - Long-press encoder button (3 seconds)
   - Follow on-screen prompts
   - System will guide through taring and calibration

### Distance Calibration

Measure your encoder wheel:

```cpp
#define WHEEL_CIRCUMFERENCE_CM  50.0f      // Measure your wheel
#define ENCODER_PULSES_PER_REV  20         // Check encoder specs
```

Formula: `Distance per pulse = Circumference / Pulses per revolution`

### Threshold Settings

Adjust sensitivity:

```cpp
#define WEIGHT_THRESHOLD_LBS    20.0f      // Min weight to detect usage
#define SESSION_START_DELAY     2000       // ms before session starts
#define SESSION_END_TIMEOUT     5000       // ms of no weight to end
#define MIN_SESSION_DURATION    3000       // Min duration to log (ms)
```

---

## Usage

### Normal Operation

1. **Power On**
   - System initializes and connects to WiFi
   - Load cells are automatically tared
   - Display shows "READY"

2. **Session Detection**
   - When combined weight exceeds threshold (default 20 lbs)
   - System starts recording after 2-second delay
   - Display shows "IN USE" with live stats

3. **Session End**
   - When weight removed for >5 seconds
   - Session data is saved to SPIFFS
   - Display returns to "READY" state

4. **Data Upload**
   - Automatic upload when 50 sessions accumulated
   - Or manually trigger via API call
   - Failed uploads are retried on next connection

### Calibration Mode

**Enter Calibration:**
- Long-press encoder button for 3 seconds

**Calibration Steps:**
1. Remove all weight → Press button to tare
2. Place known weight (e.g., 20 lbs)
3. Press button to record
4. Results shown on display and serial
5. Update calibration factors in `config.h`

### Display Information

**When Idle:**
```
READY
Today: 5 trips
Distance: 150 ft
Stored: 12
WiFi: OK
```

**During Session:**
```
IN USE
Time: 2:34
Dist: 45.2 ft
Weight: 48.3 lbs
```

### Sleep Mode

- System enters deep sleep after 10 minutes of inactivity
- Wakes on movement detection or every 60 seconds
- Conserves battery for extended use

---

## API Integration

### Expected Server Endpoint

The firmware POSTs to your configured endpoint:

**Method:** `POST`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "startTime": 1699920000,
  "endTime": 1699920300,
  "duration": 300,
  "distanceCm": 1524.5,
  "avgWeightLb": 45.2,
  "maxWeightLb": 52.1,
  "uploaded": false,
  "deviceId": "ESP32-001"
}
```

**Expected Response:**
- `200 OK` or `201 Created` for success
- Session marked as uploaded
- Any other code triggers retry

### Example Server Implementation (Python/FastAPI)

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Session(BaseModel):
    startTime: int
    endTime: int
    duration: int
    distanceCm: float
    avgWeightLb: float
    maxWeightLb: float
    deviceId: str

@app.post("/api/walker/sessions")
async def create_session(session: Session):
    # Store in database
    # Analyze trends
    # Send alerts if needed
    return {"status": "success", "id": "session_123"}
```

---

## Troubleshooting

### Load Cells Not Reading

- **Check wiring**: Verify all connections match wiring diagram
- **Check HX711 power**: Should have stable 3.3V or 5V
- **Serial monitor**: Enable `LOG_LOADCELL_VALUES` in config.h
- **Swap load cells**: Test each independently

### Distance Not Tracking

- **Check encoder wiring**: A, B, and GND must be connected
- **Enable logging**: Set `LOG_ENCODER_VALUES true` in config.h
- **Test manually**: Rotate encoder wheel and watch serial output
- **Adjust debounce**: Increase `ENCODER_DEBOUNCE_MS` if needed

### WiFi Won't Connect

- **Verify credentials**: Double-check SSID and password
- **Check signal strength**: Move closer to router
- **Serial output**: Monitor connection attempts
- **Try different network**: Test with phone hotspot

### Display Not Working

- **Check I2C address**: Try 0x3C or 0x3D
- **I2C scan**: Run I2C scanner sketch to find address
- **Check connections**: SDA/SCL must be correct
- **Disable temporarily**: Set `ENABLE_DISPLAY false`

### Battery Draining Quickly

- **Enable sleep mode**: Set `ENABLE_DEEP_SLEEP true`
- **Reduce wake interval**: Adjust `SLEEP_DURATION_SECONDS`
- **Check for shorts**: Verify no exposed wires
- **Battery capacity**: Use larger battery (3000mAh+)

### Sessions Not Saving

- **SPIFFS check**: Monitor serial for SPIFFS errors
- **Free space**: Check SPIFFS capacity in serial output
- **Session duration**: Ensure meets `MIN_SESSION_DURATION`
- **Reflash with SPIFFS**: Use "Erase All Flash" option

---

## Advanced Configuration

### Changing Units

Switch between Imperial and Metric:

```cpp
#define USE_METRIC_UNITS    true   // true = kg/m, false = lbs/ft
```

### Adjusting Sample Rates

```cpp
#define LOADCELL_SAMPLE_RATE    10        // Hz
#define DISPLAY_UPDATE_RATE     500       // ms
```

### Storage Limits

```cpp
#define MAX_SESSIONS_STORED     100       // Max local sessions
#define AUTO_UPLOAD_THRESHOLD   50        // Auto-upload count
```

### Power Management

```cpp
#define IDLE_TIMEOUT_MINUTES    10        // Minutes before sleep
#define SLEEP_DURATION_SECONDS  60        // Wake interval
#define BATTERY_LOW_VOLTAGE     3.3f      // Low battery warning
```

---

## File Structure

```
firmware/
├── platformio.ini          # PlatformIO configuration
├── include/
│   └── config.h           # All configuration settings
├── src/
│   └── main.cpp           # Main firmware code
├── data/                  # SPIFFS data (if needed)
└── README.md             # This file
```

---

## Data Format

### Session Data Structure

| Field | Type | Description |
|-------|------|-------------|
| `startTime` | unsigned long | Unix timestamp (seconds) |
| `endTime` | unsigned long | Unix timestamp (seconds) |
| `duration` | unsigned long | Session length (seconds) |
| `distanceCm` | float | Distance traveled (cm) |
| `avgWeightLb` | float | Average weight (lbs) |
| `maxWeightLb` | float | Peak weight (lbs) |
| `uploaded` | bool | Upload status |
| `deviceId` | string | Unique device identifier |

### Local Storage (SPIFFS)

Sessions stored in `/sessions.json`:

```json
{
  "sessions": [
    {
      "startTime": 1699920000,
      "endTime": 1699920300,
      "duration": 300,
      "distanceCm": 1524.5,
      "avgWeightLb": 45.2,
      "maxWeightLb": 52.1,
      "uploaded": true,
      "deviceId": "ESP32-001"
    }
  ]
}
```

---

## Performance Specifications

- **Load Cell Range**: 0-200 kg per sensor (400 kg total)
- **Weight Resolution**: ~10 grams (HX711 24-bit ADC)
- **Distance Accuracy**: ±1 cm (depends on encoder resolution)
- **Session Detection**: 2-second response time
- **Battery Life**: 24-48 hours (depends on usage, battery capacity)
- **Storage Capacity**: 100+ sessions (16KB SPIFFS allocation)
- **WiFi Range**: Standard ESP32 range (~50m open space)

---

## Safety Considerations

⚠️ **Important Safety Notes:**

1. **Weight Limits**: Do not exceed 200kg per load cell (400kg total)
2. **Electrical Safety**: Ensure all connections are insulated
3. **Battery Safety**: Use protected Li-ion/LiPo batteries only
4. **Mechanical Safety**: Securely mount load cells to walker frame
5. **Medical Device**: This is a monitoring aid, not a medical device
6. **Supervision**: Not a replacement for medical supervision

---

## License

This firmware is provided as-is for the walker monitoring project.

---

## Support and Contributions

For issues, questions, or contributions:
- Check this README first
- Review serial output for debug information
- Verify hardware connections
- Test with minimal configuration first

---

## Version History

### v1.0.0 (Current)
- Initial release
- Dual load cell support
- Rotary encoder distance tracking
- SPIFFS storage
- HTTP upload
- OLED display support
- Deep sleep mode
- Calibration mode

---

## Future Enhancements

Potential additions for future versions:
- [ ] Web-based configuration interface
- [ ] Bluetooth Low Energy (BLE) support
- [ ] SD card storage option
- [ ] Multi-language display support
- [ ] Advanced analytics (gait analysis)
- [ ] Fall detection algorithms
- [ ] Mobile app integration
- [ ] OTA (Over-The-Air) firmware updates

---

## Acknowledgments

Built with:
- ESP32 Arduino Core
- HX711 Library by Bogdan Necula
- Adafruit SSD1306 & GFX Libraries
- ArduinoJson by Benoit Blanchon
- NTPClient Library

---

**Happy Monitoring! 🚶‍♂️📊**
