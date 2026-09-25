import React, { useState } from "react";
import {
  Radio,
  Cpu,
  Wifi,
  Sun,
  Battery,
  Flame,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import { triggerSimulationPreset, postGatewayTelemetry, updateNodeSensor } from "../services/api";

export default function GatewayPage({ data = {}, onRefresh }) {
  const { gateway = {}, nodes = [], logs = [] } = data;
  const [selectedPreset, setSelectedPreset] = useState("optimal");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Manual custom payload test
  const [node1Moist, setNode1Moist] = useState(nodes[0]?.soilMoisture || 28);

  const handleSync = async () => {
    if (onRefresh) {
      setIsSyncing(true);
      await onRefresh();
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  const handleApplyPreset = async (preset) => {
    setSelectedPreset(preset);
    setStatusMessage(`Applying preset: ${preset}...`);
    try {
      await triggerSimulationPreset(preset);
      if (onRefresh) await onRefresh();
      setStatusMessage(`Preset "${preset}" applied to Gateway engine.`);
      setTimeout(() => setStatusMessage(""), 3500);
    } catch {
      setStatusMessage("Failed to apply preset.");
    }
  };

  const handleCustomNodeUpdate = async () => {
    setStatusMessage(`Injecting Node 1 Soil Moisture: ${node1Moist}%...`);
    try {
      await updateNodeSensor("NODE-1", { soilMoisture: Number(node1Moist) });
      if (onRefresh) await onRefresh();
      setStatusMessage(`Telemetry packet received! Backend recalculated.`);
      setTimeout(() => setStatusMessage(""), 3500);
    } catch {
      setStatusMessage("Telemetry push error.");
    }
  };

  return (
    <div className="page gateway-console-page">
      {/* Page Header */}
      <div className="section">
        <div className="section-header-flex">
          <div className="header-title-wrap">
            <h1 className="page-heading-main">
              <Radio size={22} className="text-green-600 inline mr-2" />
              Raspberry Pi Gateway
            </h1>
            <p className="page-heading-sub">
              Edge telemetry processor &amp; LoRaWAN concentrator
            </p>
          </div>
          <button
            onClick={handleSync}
            className={`map-refresh-btn ${isSyncing ? "spin" : ""}`}
            aria-label="Refresh gateway"
          >
            <RefreshCw size={15} />
            <span>Sync</span>
          </button>
        </div>

        {/* Hardware Status Card */}
        <div className="gw-hardware-board">
          <div className="gw-hardware-board__top">
            <div className="gw-indicator-row">
              <span className="live-dot" />
              <span className="gw-title-text">{gateway.model || "Raspberry Pi 4 Model B"}</span>
            </div>
            <span className="gw-fw-pill">{gateway.firmware || "v2.5.2-prod"}</span>
          </div>

          <div className="gw-metrics-grid">
            <div className="gw-metric-box">
              <span className="gw-m-label"><Cpu size={14} /> CPU Temp</span>
              <span className="gw-m-val">{gateway.cpuTempC || 43.2}°C</span>
              <span className="gw-m-sub">Thermal OK</span>
            </div>

            <div className="gw-metric-box">
              <span className="gw-m-label"><Activity size={14} /> Memory</span>
              <span className="gw-m-val">{gateway.ramUsage || "28%"}</span>
              <span className="gw-m-sub">RAM In Use</span>
            </div>

            <div className="gw-metric-box">
              <span className="gw-m-label"><Sun size={14} /> Solar Input</span>
              <span className="gw-m-val">{gateway.solarVoltage || 13.9} V</span>
              <span className="gw-m-sub">Battery: {gateway.batteryPct || 96}%</span>
            </div>

            <div className="gw-metric-box">
              <span className="gw-m-label"><Wifi size={14} /> LoRa Band</span>
              <span className="gw-m-val">868.1 MHz</span>
              <span className="gw-m-sub">{gateway.loraRssi || -72} dBm RSSI</span>
            </div>
          </div>

          <div className="gw-net-footer">
            <span><strong>Gateway IP:</strong> {gateway.ip || "192.168.1.108"}</span>
            <span><strong>Uptime:</strong> {gateway.uptime || "14 days"}</span>
            <span><strong>Packets:</strong> {gateway.packetsReceived || 8421}</span>
          </div>
        </div>
      </div>

      {/* Live LoRa Sensor Nodes Table */}
      <div className="section">
        <h2 className="section-title">
          <Layers size={18} /> Connected Field Nodes
        </h2>
        <div className="gw-nodes-list">
          {nodes.map((node) => (
            <div key={node.id} className="gw-node-row">
              <div className="gw-node-row__left">
                <span className={`node-live-ring ${node.active ? "node-live-ring--on" : "node-live-ring--off"}`} />
                <div>
                  <div className="gw-node-name">{node.name} ({node.id})</div>
                  <div className="gw-node-meta">
                    {node.zone} • {node.crop}
                  </div>
                </div>
              </div>

              <div className="gw-node-row__right">
                <div className="gw-reading-pill">
                  <span className="reading-label">Moisture</span>
                  <span className="reading-val">{Math.round(node.soilMoisture)}%</span>
                </div>
                <div className="gw-reading-pill">
                  <span className="reading-label">Soil Temp</span>
                  <span className="reading-val">{node.soilTemp}°C</span>
                </div>
                <div className="gw-reading-pill">
                  <span className="reading-label">Battery</span>
                  <span className="reading-val">{node.battery}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Gateway Ingestion Tester */}
      <div className="section">
        <h2 className="section-title">
          <Terminal size={18} /> Gateway Telemetry Injector
        </h2>
        <p className="section-desc">
          Test live backend processing. Injected telemetry immediately recalculates farm status, heatmap contours, and AI agronomy advice.
        </p>

        <div className="gw-simulator-card">
          <label className="sim-label">1. Quick Condition Presets</label>
          <div className="sim-presets-grid">
            <button
              className={`preset-card ${selectedPreset === "drought" ? "active" : ""}`}
              onClick={() => handleApplyPreset("drought")}
            >
              <Flame size={20} className="text-red-500" />
              <div className="preset-info">
                <span className="preset-name">Severe Drought</span>
                <span className="preset-desc">Drops Zone A to 22%, temp to 36°C</span>
              </div>
            </button>

            <button
              className={`preset-card ${selectedPreset === "rain" ? "active" : ""}`}
              onClick={() => handleApplyPreset("rain")}
            >
              <CloudRain size={20} className="text-blue-500" />
              <div className="preset-info">
                <span className="preset-name">Heavy Rainfall</span>
                <span className="preset-desc">Saturates soil to 88%, turns off pump</span>
              </div>
            </button>

            <button
              className={`preset-card ${selectedPreset === "optimal" ? "active" : ""}`}
              onClick={() => handleApplyPreset("optimal")}
            >
              <CheckCircle2 size={20} className="text-green-500" />
              <div className="preset-info">
                <span className="preset-name">Optimal Agronomy</span>
                <span className="preset-desc">Balanced moisture (55-65%)</span>
              </div>
            </button>

            <button
              className={`preset-card ${selectedPreset === "node_offline" ? "active" : ""}`}
              onClick={() => handleApplyPreset("node_offline")}
            >
              <AlertTriangle size={20} className="text-amber-500" />
              <div className="preset-info">
                <span className="preset-name">Node 2 Telemetry Loss</span>
                <span className="preset-desc">Simulates LoRa packet timeout</span>
              </div>
            </button>
          </div>

          <label className="sim-label mt-4">2. Fine Sensor Adjustment (Node 1 - Tomato)</label>
          <div className="slider-box-card">
            <div className="slider-row">
              <span>Soil Moisture:</span>
              <span className="slider-number">{node1Moist}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={node1Moist}
              onChange={(e) => setNode1Moist(e.target.value)}
              className="injector-range"
            />
            <button
              className="btn btn--primary btn--full mt-2"
              onClick={handleCustomNodeUpdate}
            >
              <Send size={15} /> Send Packet to Raspberry Pi Backend
            </button>
          </div>

          {statusMessage && (
            <div className="gw-status-alert">
              <Activity size={16} />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Raw Telemetry Packet Logs */}
      <div className="section">
        <h2 className="section-title">
          <Terminal size={18} /> Gateway Telemetry Logs
        </h2>
        <div className="gw-console-log-box">
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="gw-log-line">
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-msg">{log.message}</span>
              </div>
            ))
          ) : (
            <div className="gw-log-line">No recent logs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
