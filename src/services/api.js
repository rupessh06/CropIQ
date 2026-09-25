// CropIQ API Service Layer
// Communicates with the Raspberry Pi Gateway & Backend Engine at /api

import { mockFarmData, mockTodayReport, mockWeeklyReport, mockHistory } from "../data/mockData";

const API_BASE = "";

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] Fetch failed for ${endpoint}:`, err.message);
    return null;
  }
}

// Unified Full State
export async function getDashboardState() {
  const data = await apiFetch("/api/dashboard");
  return data || mockFarmData;
}

export async function getLatestFarmData() {
  return getDashboardState();
}

export async function getFarmStatus() {
  const data = await apiFetch("/api/farm/status");
  return data || mockFarmData.status;
}

export async function getFarmMap() {
  const data = await apiFetch("/api/map");
  return data;
}

export async function getAIRecommendations() {
  const data = await apiFetch("/api/ai/recommendations");
  return data;
}

export async function getGatewayStatus() {
  const data = await apiFetch("/api/gateway/status");
  return data;
}

// Pump & Relay Controls
export async function turnPumpOn() {
  const data = await apiFetch("/api/pump/on", { method: "POST" });
  return data || { success: true, pump: { isOn: true, status: "on" } };
}

export async function turnPumpOff() {
  const data = await apiFetch("/api/pump/off", { method: "POST" });
  return data || { success: true, pump: { isOn: false, status: "off" } };
}

export async function togglePumpRelay() {
  const data = await apiFetch("/api/pump/toggle", { method: "POST" });
  return data || { success: true };
}

export async function setSmartIrrigation(enabled) {
  const data = await apiFetch("/api/irrigation/smart", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
  return data || { success: true, enabled };
}

// Node and Gateway Simulator Controls
export async function updateNodeSensor(nodeId, updates) {
  const data = await apiFetch("/api/node/update", {
    method: "POST",
    body: JSON.stringify({ nodeId, ...updates }),
  });
  return data;
}

export async function triggerSimulationPreset(preset) {
  const data = await apiFetch("/api/gateway/simulate", {
    method: "POST",
    body: JSON.stringify({ preset }),
  });
  return data;
}

export async function postGatewayTelemetry(payload) {
  const data = await apiFetch("/api/gateway/telemetry", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

// Schedules & Crop Setup
export async function setCrop(cropType) {
  const data = await apiFetch("/api/crop/set", {
    method: "POST",
    body: JSON.stringify({ cropType }),
  });
  return data || { success: true, crop: cropType };
}

export async function createIrrigationSchedule(schedule) {
  return { success: true, id: Date.now().toString(), ...schedule };
}

export async function updateIrrigationSchedule(id, schedule) {
  return { success: true, id, ...schedule };
}

export async function getReports() {
  const data = await apiFetch("/api/reports");
  return data || { today: mockTodayReport, weekly: mockWeeklyReport, history: mockHistory };
}
