import express from "express";
import cors from "cors";
import { gatewayEngine } from "./gatewayEngine.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Log incoming API calls
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CropIQ Raspberry Pi Gateway & Backend Engine",
    time: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Gateway Telemetry Ingestion (Raspberry Pi pushes its payload here)
app.post("/api/gateway/telemetry", (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ error: "Missing telemetry payload" });
    }
    const state = gatewayEngine.ingestGatewayTelemetry(payload);
    res.json({
      success: true,
      message: "Gateway telemetry processed successfully",
      gatewayId: state.gateway.id,
      healthScore: state.status.healthScore,
      activeRecommendations: state.recommendations.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Telemetry ingestion error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Full unified dashboard state
app.get("/api/dashboard", (req, res) => {
  try {
    const state = gatewayEngine.getDashboardState();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Farm status only
app.get("/api/farm/data", (req, res) => {
  res.json(gatewayEngine.getDashboardState());
});

app.get("/api/farm/status", (req, res) => {
  const state = gatewayEngine.getDashboardState();
  res.json(state.status);
});

// Farm map & spatial heatmaps
app.get("/api/map", (req, res) => {
  const state = gatewayEngine.getDashboardState();
  res.json({
    nodes: state.nodes,
    heatmap: state.heatmap,
    gateway: state.gateway,
    farm: state.farm,
    pump: state.pump,
  });
});

// AI agronomy recommendations
app.get("/api/ai/recommendations", (req, res) => {
  const state = gatewayEngine.getDashboardState();
  res.json({
    recommendations: state.recommendations,
    status: state.status,
    soil: state.soil,
    timestamp: new Date().toISOString(),
  });
});

// Gateway hardware status & logs
app.get("/api/gateway/status", (req, res) => {
  const state = gatewayEngine.getDashboardState();
  res.json({
    gateway: state.gateway,
    nodes: state.nodes,
    logs: state.logs,
  });
});

// Pump relay control
app.post("/api/pump/toggle", (req, res) => {
  const pump = gatewayEngine.togglePump();
  res.json({ success: true, pump });
});

app.post("/api/pump/on", (req, res) => {
  const pump = gatewayEngine.togglePump(true);
  res.json({ success: true, pump });
});

app.post("/api/pump/off", (req, res) => {
  const pump = gatewayEngine.togglePump(false);
  res.json({ success: true, pump });
});

// Irrigation smart mode
app.post("/api/irrigation/smart", (req, res) => {
  const { enabled } = req.body;
  gatewayEngine.pump.mode = enabled ? "smart_auto" : "manual";
  gatewayEngine.addTelemetryLog(`Irrigation mode switched to: ${gatewayEngine.pump.mode}`);
  res.json({ success: true, mode: gatewayEngine.pump.mode });
});

// Node specific updates (for real-time manual testing or Pi simulator)
app.post("/api/node/update", (req, res) => {
  const { nodeId, soilMoisture, soilTemp, ambientTemp, active } = req.body;
  const node = gatewayEngine.nodes.find((n) => n.id === nodeId);
  if (!node) {
    return res.status(404).json({ error: "Node not found" });
  }

  if (typeof soilMoisture === "number") node.soilMoisture = soilMoisture;
  if (typeof soilTemp === "number") node.soilTemp = soilTemp;
  if (typeof ambientTemp === "number") node.ambientTemp = ambientTemp;
  if (typeof active === "boolean") node.active = active;
  node.lastSeen = new Date().toISOString();

  gatewayEngine.addTelemetryLog(`Updated ${node.id} (${node.name}): Soil Moisture ${node.soilMoisture}%`);
  const state = gatewayEngine.getDashboardState();
  res.json({ success: true, node, state });
});

// Simulation presets
app.post("/api/gateway/simulate", (req, res) => {
  const { preset } = req.body;
  const state = gatewayEngine.setSimulationPreset(preset);
  res.json({ success: true, preset, state });
});

// Crop setting
app.post("/api/crop/set", (req, res) => {
  const { cropType } = req.body;
  const cropNames = {
    tomato: "Tomato",
    rice: "Rice",
    wheat: "Wheat",
    potato: "Potato",
    maize: "Maize",
  };
  const cropName = cropNames[cropType] || cropType;
  gatewayEngine.farm.crop = cropName;
  gatewayEngine.farm.cropType = cropType;
  gatewayEngine.addTelemetryLog(`Active farm crop profile updated to: ${cropName}`);
  res.json({ success: true, crop: cropName });
});

// Reports endpoint
app.get("/api/reports", (req, res) => {
  res.json({
    today: {
      waterUsed: gatewayEngine.pump.totalLitresToday,
      pumpRuntimeMinutes: 45,
      avgMoisture: gatewayEngine.getDashboardState().soil.moisture,
      costEstimate: "?18.40",
    },
    weekly: {
      totalWaterM3: 9.8,
      pumpHours: 5.2,
      irrigationCycles: 14,
      avgEfficiencyScore: "94%",
    },
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  CropIQ Gateway & Processing Server`);
  console.log(`  Live at: http://localhost:${PORT}`);
  console.log(`  Gateway Telemetry Endpoint: POST /api/gateway/telemetry`);
  console.log(`===============================================`);
});
