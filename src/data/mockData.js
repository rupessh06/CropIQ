// CropIQ Mock Data
// All data structures match the expected API response format from Raspberry Pi.

export const mockFarmData = {
  farm: {
    id: "farm-001",
    name: "My Farm",
    location: "Nashik, Maharashtra",
    distanceKm: 12,
    crop: "Tomato",
    cropProfile: "Tomato Standard",
    cropType: "tomato",
    growthStage: "Flowering",
    areaHectares: 1.2,
  },

  status: {
    farmOnline: true,
    gatewayOnline: true,
    internetConnected: true,
    lastUpdated: new Date().toISOString(),
    overallStatus: "good",
    overallMessage: "Your farm looks good",
  },

  soil: {
    soil_raw: 1842,
    soil_percent: 68,
    soil_status: "moist",
    statusLabel: "Moist",
    needsWater: false,
  },

  environment: {
    temperatureC: 29.5,
    humidityPercent: 72,
    rainDetected: false,
    rainStatus: "No rain",
  },

  pump: {
    isOn: false,
    status: "off",
    lastStarted: null,
    lastStopped: "2026-09-24T06:20:00+05:30",
    runDurationMinutes: 20,
  },

  irrigation: {
    smartIrrigationEnabled: true,
    maxDurationMinutes: 20,
    recommendation: "No action needed.",
    recommendationDetail: "Soil moisture is adequate. No irrigation needed today.",
    irrigationNeeded: false,
    schedules: [
      {
        id: "sched-001",
        startTime: "06:00",
        durationMinutes: 20,
        repeat: "daily",
        repeatLabel: "Every day",
        enabled: true,
      },
    ],
  },

  node: {
    id: "node-001",
    name: "Field Node 01",
    online: true,
    batteryPercent: 78,
    solarCharging: true,
    solarStatus: "charging",
    lastCommunication: new Date().toISOString(),
    lastCommunicationLabel: "Just now",
    firmwareVersion: "1.2.3",
  },

  cropProfile: {
    crop: "Tomato",
    profile: "Tomato Standard",
    status: "active",
    waterNeed: "Moderate",
    temperatureSuitability: "Suitable",
    currentCondition: "Good",
    recommendedSoilMin: 50,
    recommendedSoilMax: 80,
    recommendedTempMin: 18,
    recommendedTempMax: 32,
  },

  alerts: [],
};

export const mockHistory = [
  {
    date: "Today",
    entries: [
      { time: "9:00 AM", soilStatus: "Moist", pumpStatus: "OFF", event: "Soil moist — pump off" },
      { time: "6:20 AM", soilStatus: "Moist", pumpStatus: "OFF", event: "Scheduled irrigation complete", duration: "20 min" },
      { time: "6:00 AM", soilStatus: "Dry", pumpStatus: "ON", event: "Scheduled irrigation started" },
    ],
  },
  {
    date: "Yesterday",
    entries: [
      { time: "6:00 AM", soilStatus: "Moist", pumpStatus: "OFF", event: "Scheduled irrigation complete", duration: "20 min" },
    ],
  },
];

export const mockWeeklyReport = {
  wateringCount: 4,
  averageTemperatureC: 29,
  rainEvents: 2,
  cropCondition: "Stable",
  irrigationMinutes: 80,
};

export const mockTodayReport = {
  soilStatus: "Good",
  temperatureStatus: "Normal",
  rainStatus: "No rain",
  irrigationMinutes: 20,
  cropStatus: "Good",
};

export const mockFarmNodes = [
  { id: 1, x: 20, y: 30, moisture: 35, temp: 29, active: true },
  { id: 2, x: 70, y: 20, moisture: 68, temp: 28, active: true },
  { id: 3, x: 50, y: 60, moisture: 75, temp: 29, active: true },
  { id: 4, x: 85, y: 75, moisture: 85, temp: 27, active: true },
  { id: 5, x: 25, y: 80, moisture: 45, temp: 29, active: false }
];
