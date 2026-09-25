// CropIQ Raspberry Pi Gateway & Agronomy Processing Engine
// Handles telemetry ingestion, spatial interpolation, crop stress modeling, and AI recommendations.

class GatewayEngine {
  constructor() {
    this.gateway = {
      id: "RPI-GW-04B",
      name: "CropIQ Master Gateway",
      model: "Raspberry Pi 4 Model B (4GB)",
      firmware: "v2.5.2-prod",
      status: "online",
      ip: "192.168.1.108",
      uptime: "14 days, 6 hours",
      cpuTempC: 43.2,
      ramUsage: "28%",
      loraFrequency: "868.1 MHz (EU/IN Band)",
      loraRssi: -72,
      batteryPct: 96,
      solarVoltage: 13.9,
      lastPacketAt: new Date().toISOString(),
      packetsReceived: 8421,
    };

    this.pump = {
      isOn: false,
      status: "off",
      flowRateLpm: 0,
      pressureBar: 2.2,
      totalLitresToday: 1350,
      mode: "smart_auto", // manual, scheduled, smart_auto
      autoShutoffMinutes: 30,
      activeSince: null,
      lastStopped: "Today, 06:20 AM",
      runDurationMinutes: 20,
    };

    this.farm = {
      id: "farm-001",
      name: "GreenValley Farm",
      location: "Sector 4, West Parcel",
      totalAreaHa: 2.4,
      areaHectares: 2.4,
      distanceKm: 4.2,
      crop: "Tomato",
      cropType: "tomato",
      variety: "Arka Rakshak (High Yield Drip)",
      sowingDate: "2026-08-10",
      stage: "Flowering & Fruit Development",
      soilType: "Sandy Loam",
    };

    this.nodes = [
      {
        id: "NODE-1",
        name: "North Parcel",
        zone: "Zone A",
        x: 28,
        y: 28,
        crop: "Tomato (Main Bed)",
        soilMoisture: 28.5,
        soilMoistureDeep: 34.0,
        soilTemp: 23.4,
        ambientTemp: 31.8,
        ambientHumidity: 48,
        ec: 1.4,
        ph: 6.5,
        sunlightLux: 62000,
        battery: 88,
        signalDbm: -68,
        active: true,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "NODE-2",
        name: "Drip Polyhouse",
        zone: "Zone B",
        x: 74,
        y: 28,
        crop: "Bell Pepper (Covered)",
        soilMoisture: 58.2,
        soilMoistureDeep: 61.5,
        soilTemp: 22.1,
        ambientTemp: 28.4,
        ambientHumidity: 68,
        ec: 1.8,
        ph: 6.2,
        sunlightLux: 45000,
        battery: 92,
        signalDbm: -74,
        active: true,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "NODE-3",
        name: "South Orchard",
        zone: "Zone C",
        x: 28,
        y: 74,
        crop: "Pomegranate / Citrus",
        soilMoisture: 52.0,
        soilMoistureDeep: 55.4,
        soilTemp: 24.0,
        ambientTemp: 32.5,
        ambientHumidity: 45,
        ec: 1.2,
        ph: 6.8,
        sunlightLux: 71000,
        battery: 79,
        signalDbm: -82,
        active: true,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "NODE-4",
        name: "Nursery Beds",
        zone: "Zone D",
        x: 74,
        y: 74,
        crop: "Seedlings & Microgreens",
        soilMoisture: 64.8,
        soilMoistureDeep: 68.0,
        soilTemp: 21.8,
        ambientTemp: 29.1,
        ambientHumidity: 72,
        ec: 1.1,
        ph: 6.3,
        sunlightLux: 38000,
        battery: 95,
        signalDbm: -65,
        active: true,
        lastSeen: new Date().toISOString(),
      },
    ];

    this.schedules = [
      { id: "sched-001", startTime: "06:00", durationMinutes: 30, repeat: "daily", repeatLabel: "Every day", enabled: true, zone: "All Zones" },
      { id: "sched-002", startTime: "17:30", durationMinutes: 20, repeat: "custom", repeatLabel: "Tue, Thu, Sat", enabled: true, zone: "Zone A" },
    ];

    this.telemetryLogs = [];
    this.addTelemetryLog("Raspberry Pi Gateway initialized. LoRa Concentrator & Ethernet online.");
  }

  addTelemetryLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.telemetryLogs.unshift({ timestamp, message, id: Date.now() + Math.random() });
    if (this.telemetryLogs.length > 30) this.telemetryLogs.pop();
  }

  // Ingestion from Raspberry Pi Gateway
  ingestGatewayTelemetry(payload) {
    this.gateway.packetsReceived += 1;
    this.gateway.lastPacketAt = new Date().toISOString();

    if (payload.hardware) {
      if (typeof payload.hardware.cpuTemp === "number") this.gateway.cpuTempC = payload.hardware.cpuTemp;
      if (payload.hardware.ramUsage) this.gateway.ramUsage = payload.hardware.ramUsage;
      if (payload.hardware.uptime) this.gateway.uptime = payload.hardware.uptime;
      if (payload.hardware.ip) this.gateway.ip = payload.hardware.ip;
      if (typeof payload.hardware.loraRssi === "number") this.gateway.loraRssi = payload.hardware.loraRssi;
    }

    if (payload.power) {
      if (typeof payload.power.batteryPct === "number") this.gateway.batteryPct = payload.power.batteryPct;
      if (typeof payload.power.solarVoltage === "number") this.gateway.solarVoltage = payload.power.solarVoltage;
    }

    if (payload.nodes && Array.isArray(payload.nodes)) {
      payload.nodes.forEach((incomingNode) => {
        const existing = this.nodes.find((n) => n.id === incomingNode.id);
        if (existing) {
          Object.assign(existing, incomingNode, { lastSeen: new Date().toISOString() });
        } else {
          this.nodes.push({ ...incomingNode, lastSeen: new Date().toISOString() });
        }
      });
    }

    if (payload.pump) {
      if (typeof payload.pump.isOn === "boolean") {
        this.pump.isOn = payload.pump.isOn;
        this.pump.status = payload.pump.isOn ? "on" : "off";
        this.pump.flowRateLpm = payload.pump.isOn ? 38.5 : 0;
      }
    }

    this.addTelemetryLog(`Ingested packet from Gateway ${this.gateway.id} (${this.nodes.length} nodes updated)`);
    return this.getDashboardState();
  }

  // Agronomy Engine: calculate stress, health score, and backend AI recommendations
  calculateAgronomyInsights() {
    const activeNodes = this.nodes.filter((n) => n.active);
    const avgMoisture = activeNodes.length
      ? Math.round(activeNodes.reduce((acc, n) => acc + n.soilMoisture, 0) / activeNodes.length)
      : 0;

    const avgAmbientTemp = activeNodes.length
      ? (activeNodes.reduce((acc, n) => acc + n.ambientTemp, 0) / activeNodes.length).toFixed(1)
      : 30.0;

    const avgAmbientHumidity = activeNodes.length
      ? Math.round(activeNodes.reduce((acc, n) => acc + n.ambientHumidity, 0) / activeNodes.length)
      : 55;

    let healthScore = 96;
    let overallStatus = "good";
    let overallMessage = "Your farm is healthy and thriving";

    const dryNodes = activeNodes.filter((n) => n.soilMoisture < 38);
    const wetNodes = activeNodes.filter((n) => n.soilMoisture > 75);
    const offlineNodes = this.nodes.filter((n) => !n.active);

    if (dryNodes.length > 0) {
      healthScore -= dryNodes.length * 14;
      overallStatus = dryNodes.length > 1 ? "alert" : "needs_attention";
      overallMessage = `${dryNodes.map((n) => n.zone).join(", ")} soil moisture below optimal threshold`;
    }

    if (wetNodes.length > 0) {
      healthScore -= 6;
      if (overallStatus === "good") {
        overallStatus = "needs_attention";
        overallMessage = `${wetNodes.map((n) => n.zone).join(", ")} saturated soil moisture`;
      }
    }

    if (offlineNodes.length > 0) {
      healthScore -= offlineNodes.length * 10;
    }

    healthScore = Math.max(18, Math.min(99, healthScore));

    // Dynamic AI Recommendations generated in Backend
    const recommendations = [];

    // 1. Dry zone irrigation advice
    if (dryNodes.length > 0) {
      const targetNode = dryNodes[0];
      const deficitPct = (55 - targetNode.soilMoisture).toFixed(1);
      const estLitres = Math.round(deficitPct * 18);
      const isHotMidday = Number(avgAmbientTemp) > 30;

      recommendations.push({
        id: "reco-irrigation-deficit",
        type: "warning",
        category: "Precision Irrigation",
        title: `Irrigate ${targetNode.zone} (${targetNode.crop})`,
        text: `Moisture in ${targetNode.zone} is down to ${targetNode.soilMoisture}% (Deficit: ${deficitPct}%). Drip application of ~${estLitres}L recommended to prevent fruit drop.`,
        actionLabel: `Run Zone ${targetNode.zone.replace("Zone ", "")} Drip (${estLitres}L)`,
        actionType: "pump_run",
        confidence: 96,
        priority: 1,
        details: isHotMidday
          ? `Midday canopy heat (${avgAmbientTemp}°C) causes high vapor deficit. Recommend late-afternoon cycle (17:00) to cut evaporative water loss by 28%.`
          : `Ambient condition (${avgAmbientTemp}°C) is suitable for immediate drip absorption.`,
      });
    }

    // 2. High humidity / fungal pathogen risk
    if (Number(avgAmbientHumidity) >= 65 && Number(avgAmbientTemp) >= 24) {
      recommendations.push({
        id: "reco-fungal-risk",
        type: "critical",
        category: "Crop Pathology Alert",
        title: "Early Blight & Powdery Mildew Risk",
        text: `Ambient humidity is ${avgAmbientHumidity}% with canopy temperature of ${avgAmbientTemp}°C. Fungal spore germination index is elevated.`,
        actionLabel: "Inspect Polyhouse Leaves",
        actionType: "inspection",
        confidence: 91,
        priority: 2,
        details: "Activate side-curtain ventilation in polyhouse. Avoid any overhead foliar watering.",
      });
    }

    // 3. Excess moisture alert
    if (wetNodes.length > 0) {
      const wetNode = wetNodes[0];
      recommendations.push({
        id: "reco-waterlogging",
        type: "warning",
        category: "Drainage Control",
        title: `High Soil Moisture in ${wetNode.zone}`,
        text: `${wetNode.zone} moisture is ${wetNode.soilMoisture}%. High risk of root hypoxia. Drip cycle auto-paused.`,
        actionLabel: "Pause Zone Valve",
        actionType: "pump_pause",
        confidence: 94,
        priority: 3,
        details: "Soil oxygen diffusion drops above 75% saturation. Delay irrigation by 24-36 hours.",
      });
    }

    // 4. Offline nodes
    if (offlineNodes.length > 0) {
      recommendations.push({
        id: "reco-node-offline",
        type: "critical",
        category: "Hardware Watchdog",
        title: `Gateway Telemetry Loss: ${offlineNodes.map((n) => n.id).join(", ")}`,
        text: `Node ${offlineNodes.map((n) => n.id).join(", ")} (${offlineNodes.map((n) => n.zone).join(", ")}) missed heartbeats. Check battery or LoRa antenna.`,
        actionLabel: "Gateway Diagnostic Ping",
        actionType: "ping_node",
        confidence: 99,
        priority: 0,
        details: "LoRa RSSI dropped below -110 dBm prior to communication loss.",
      });
    }

    // 5. Optimal balance state
    if (recommendations.length === 0) {
      recommendations.push({
        id: "reco-optimal",
        type: "good",
        category: "Crop Balance",
        title: "Farm Hydration & Microclimate Optimal",
        text: "Soil moisture and canopy transpiration are at peak physiological equilibrium for current growth stage. No emergency action required.",
        actionLabel: "Keep Auto Schedule",
        actionType: "none",
        confidence: 98,
        priority: 4,
        details: "Next scheduled cycle is configured for 17:30 PM.",
      });
    }

    return {
      healthScore,
      overallStatus,
      overallMessage,
      avgMoisture,
      avgAmbientTemp,
      avgAmbientHumidity,
      recommendations,
      dryCount: dryNodes.length,
      wetCount: wetNodes.length,
      offlineCount: offlineNodes.length,
    };
  }

  // Spatial IDW grid interpolation
  getSpatialHeatmap() {
    const gridSize = 8;
    const grid = [];
    const activeNodes = this.nodes.filter((n) => n.active);

    for (let r = 0; r < gridSize; r++) {
      const row = [];
      const py = (r / (gridSize - 1)) * 100;
      for (let c = 0; c < gridSize; c++) {
        const px = (c / (gridSize - 1)) * 100;

        let numMoist = 0;
        let numTemp = 0;
        let den = 0;

        activeNodes.forEach((node) => {
          const dist = Math.hypot(node.x - px, node.y - py);
          const weight = 1 / Math.pow(Math.max(dist, 5), 2);
          numMoist += node.soilMoisture * weight;
          numTemp += node.soilTemp * weight;
          den += weight;
        });

        const moisture = den > 0 ? Math.round(numMoist / den) : 50;
        const temp = den > 0 ? Number((numTemp / den).toFixed(1)) : 23.0;
        const ndvi = Number((0.48 + (moisture / 100) * 0.38 - Math.max(0, (temp - 30) * 0.015)).toFixed(2));

        row.push({ x: Math.round(px), y: Math.round(py), moisture, temp, ndvi });
      }
      grid.push(row);
    }

    return {
      gridSize,
      grid,
      zones: [
        {
          id: "A",
          name: "Zone A - Tomato North",
          crop: "Tomato",
          areaHa: 0.8,
          nodeId: "NODE-1",
          moisture: this.nodes[0]?.soilMoisture || 28,
          temp: this.nodes[0]?.soilTemp || 23.4,
          status: (this.nodes[0]?.soilMoisture || 28) < 38 ? "Dry" : "Optimal",
        },
        {
          id: "B",
          name: "Zone B - Drip Polyhouse",
          crop: "Bell Pepper",
          areaHa: 0.4,
          nodeId: "NODE-2",
          moisture: this.nodes[1]?.soilMoisture || 58,
          temp: this.nodes[1]?.soilTemp || 22.1,
          status: "Optimal",
        },
        {
          id: "C",
          name: "Zone C - South Orchard",
          crop: "Citrus & Pomegranate",
          areaHa: 0.9,
          nodeId: "NODE-3",
          moisture: this.nodes[2]?.soilMoisture || 52,
          temp: this.nodes[2]?.soilTemp || 24.0,
          status: "Optimal",
        },
        {
          id: "D",
          name: "Zone D - Nursery Beds",
          crop: "Seedlings",
          areaHa: 0.3,
          nodeId: "NODE-4",
          moisture: this.nodes[3]?.soilMoisture || 64,
          temp: this.nodes[3]?.soilTemp || 21.8,
          status: "Optimal",
        },
      ],
    };
  }

  // Unified Dashboard State
  getDashboardState() {
    const insights = this.calculateAgronomyInsights();
    const heatmap = this.getSpatialHeatmap();

    const soilStatus = insights.avgMoisture < 38 ? "dry" : insights.avgMoisture > 75 ? "wet" : "moist";

    const alerts = [];
    if (insights.dryCount > 0) {
      alerts.push({
        id: "alert-dry",
        type: "urgent",
        icon: "droplet",
        title: "Soil Moisture Low",
        body: `${insights.overallMessage}. Irrigation recommended to maintain yield.`,
        actionLabel: "Open Pump Control",
        actionNav: "control",
        timestamp: "Just now",
      });
    }

    if (insights.offlineCount > 0) {
      alerts.push({
        id: "alert-node-offline",
        type: "warning",
        icon: "wifi-off",
        title: "Gateway Telemetry Alert",
        body: `${insights.offlineCount} sensor node(s) have unconfirmed heartbeats.`,
        actionLabel: "View Gateway",
        actionNav: "gateway",
        timestamp: "2 mins ago",
      });
    }

    const masterNode = this.nodes[0] || {};

    return {
      farm: {
        ...this.farm,
        fieldCount: 4,
        totalNodes: this.nodes.length,
        activeNodes: this.nodes.filter((n) => n.active).length,
      },
      status: {
        farmOnline: true,
        gatewayOnline: true,
        internetConnected: true,
        overallStatus: insights.overallStatus,
        overallMessage: insights.overallMessage,
        healthScore: insights.healthScore,
        lastUpdated: new Date().toISOString(),
        lastUpdatedLabel: "Just now",
      },
      soil: {
        soil_raw: 1842,
        soil_percent: insights.avgMoisture,
        soil_status: soilStatus,
        statusLabel: soilStatus === "dry" ? "Dry" : soilStatus === "wet" ? "Wet" : "Moist",
        needsWater: insights.dryCount > 0,
        moisture: insights.avgMoisture,
        temperature: Number(
          (this.nodes.reduce((a, b) => a + b.soilTemp, 0) / this.nodes.length).toFixed(1)
        ),
        targetRange: "45% - 65%",
        rainDetected: false,
      },
      environment: {
        temperatureC: Number(insights.avgAmbientTemp),
        humidityPercent: insights.avgAmbientHumidity,
        rainDetected: false,
        rainStatus: "No rain",
        lux: Math.round(this.nodes.reduce((a, b) => a + b.sunlightLux, 0) / this.nodes.length),
        pressureHpa: 1013,
      },
      pump: {
        ...this.pump,
        displayStatus: this.pump.isOn ? "RUNNING" : "STANDBY",
      },
      irrigation: {
        smartIrrigationEnabled: this.pump.mode === "smart_auto",
        irrigationNeeded: insights.dryCount > 0,
        waterDeliveredToday: this.pump.totalLitresToday,
        lastIrrigated: "Today, 06:20 AM",
        nextIrrigation: "Today, 17:30 PM",
        schedules: this.schedules,
      },
      node: {
        id: masterNode.id || "NODE-1",
        name: `${masterNode.name || "Master Node"} (LoRa)`,
        online: masterNode.active ?? true,
        batteryPercent: masterNode.battery ?? 88,
        solarCharging: true,
        solarStatus: "charging",
        lastCommunication: new Date().toISOString(),
        lastCommunicationLabel: "Just now",
        firmwareVersion: "v2.5.2",
        signalStrength: `${masterNode.signalDbm ?? -68} dBm`,
      },
      cropProfile: {
        crop: this.farm.crop,
        profile: `${this.farm.crop} Standard Drip`,
        status: "active",
        waterNeed: insights.dryCount > 0 ? "High" : "Moderate",
        temperatureSuitability: "Suitable",
        currentCondition: insights.overallStatus === "good" ? "Good" : "Stressed",
        recommendedSoilMin: 45,
        recommendedSoilMax: 65,
        recommendedTempMin: 18,
        recommendedTempMax: 32,
        daysPlanted: 46,
        stage: this.farm.stage,
      },
      nodes: this.nodes,
      heatmap,
      recommendations: insights.recommendations,
      alerts,
      gateway: this.gateway,
      logs: this.telemetryLogs,
    };
  }

  // Toggle pump
  togglePump(state) {
    if (typeof state === "boolean") {
      this.pump.isOn = state;
    } else {
      this.pump.isOn = !this.pump.isOn;
    }
    this.pump.status = this.pump.isOn ? "on" : "off";
    this.pump.flowRateLpm = this.pump.isOn ? 38.5 : 0;
    this.pump.activeSince = this.pump.isOn ? new Date().toISOString() : null;

    this.addTelemetryLog(`Relay switch: Irrigation Pump switched ${this.pump.status.toUpperCase()} via backend command.`);
    return this.pump;
  }

  // Set simulation preset
  setSimulationPreset(preset) {
    if (preset === "drought") {
      this.nodes[0].soilMoisture = 22.4;
      this.nodes[2].soilMoisture = 31.0;
      this.nodes.forEach((n) => {
        n.ambientTemp = 36.2;
        n.ambientHumidity = 32;
      });
      this.addTelemetryLog("Simulator: Injected Severe Heat & Drought Telemetry Packet.");
    } else if (preset === "rain") {
      this.nodes.forEach((n) => {
        n.soilMoisture = Math.min(95, n.soilMoisture + 35);
        n.ambientTemp = 23.5;
        n.ambientHumidity = 92;
      });
      this.pump.isOn = false;
      this.pump.status = "off";
      this.pump.flowRateLpm = 0;
      this.addTelemetryLog("Simulator: Injected Post-Heavy Rain Saturated Telemetry Packet.");
    } else if (preset === "optimal") {
      this.nodes[0].soilMoisture = 54.0;
      this.nodes[1].soilMoisture = 58.5;
      this.nodes[2].soilMoisture = 52.0;
      this.nodes[3].soilMoisture = 62.0;
      this.nodes.forEach((n) => {
        n.active = true;
        n.ambientTemp = 28.5;
        n.ambientHumidity = 58;
      });
      this.addTelemetryLog("Simulator: Reset to Optimal Agricultural Agronomy Baseline.");
    } else if (preset === "node_offline") {
      this.nodes[1].active = false;
      this.addTelemetryLog("Simulator: Simulated LoRa Packet Timeout on Node-2.");
    }
    return this.getDashboardState();
  }
}

export const gatewayEngine = new GatewayEngine();
