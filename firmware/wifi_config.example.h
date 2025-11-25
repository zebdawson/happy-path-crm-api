/**
 * WiFi Configuration Example
 *
 * Copy this file to 'include/wifi_config.h' and update with your credentials.
 * The wifi_config.h file is gitignored to keep your credentials secure.
 *
 * Usage:
 *   1. Copy: cp wifi_config.example.h include/wifi_config.h
 *   2. Edit include/wifi_config.h with your WiFi and API details
 *   3. Include in main.cpp: #include "wifi_config.h"
 */

#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

// ============================================================================
// WIFI CREDENTIALS
// ============================================================================

// Your WiFi network name
#define WIFI_SSID           "YourWiFiNetworkName"

// Your WiFi password
#define WIFI_PASSWORD       "YourWiFiPassword"

// Optional: Backup WiFi network (if primary fails)
#define WIFI_SSID_BACKUP    "BackupNetworkName"
#define WIFI_PASSWORD_BACKUP "BackupPassword"


// ============================================================================
// API CONFIGURATION
// ============================================================================

// Your API endpoint for uploading session data
// This should be a full URL including protocol (http:// or https://)
#define API_ENDPOINT        "https://your-api-server.com/api/walker/sessions"

// Optional: API authentication token
// Uncomment and set if your API requires authentication
// #define API_AUTH_TOKEN      "your-auth-token-here"

// Optional: Device-specific API key
// #define API_KEY             "your-device-api-key"


// ============================================================================
// DEVICE IDENTIFICATION
// ============================================================================

// Unique identifier for this device
// Change this for each walker/device you deploy
#define DEVICE_ID           "WALKER-001"

// Optional: User/Patient identifier
// #define USER_ID             "USER-123"


// ============================================================================
// NTP TIME SERVER (Optional)
// ============================================================================

// NTP server for time synchronization
#define NTP_SERVER          "pool.ntp.org"

// Timezone offset in seconds
// Examples:
//   UTC: 0
//   EST: -18000 (UTC-5)
//   PST: -28800 (UTC-8)
//   CET: 3600 (UTC+1)
#define NTP_OFFSET_SECONDS  0


// ============================================================================
// ADVANCED NETWORKING (Optional)
// ============================================================================

// Static IP configuration (leave commented for DHCP)
// #define USE_STATIC_IP
// #define STATIC_IP           192, 168, 1, 100
// #define GATEWAY_IP          192, 168, 1, 1
// #define SUBNET_MASK         255, 255, 255, 0
// #define DNS_SERVER          8, 8, 8, 8


#endif // WIFI_CONFIG_H
