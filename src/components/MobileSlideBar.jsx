import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Home,
  Layers,
  BrainCircuit,
  Zap,
  Radio,
  Sliders,
  Cpu,
  Wifi,
  Sun,
  Flame,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { triggerSimulationPreset, updateNodeSensor } from "../services/api";

export default function MobileSlideBar({
  isOpen,
  onClose,
  activeTab,
  onNavChange,
  gateway = {},
  nodes = [],
  onDataRefresh,
}) {
  const { t } = useTranslation();
  const [sliderMoisture, setSliderMoisture] = useState(28);
  const [injecting, setInjecting] = useState(false);
  const [injectMsg, setInjectMsg] = useState("");

  if (!isOpen) return null;

  const handleNav = (tabId) => {
    onNavChange(tabId);
    onClose();
  };

  const handlePreset = async (presetName) => {
    setInjecting(true);
    setInjectMsg(`Injecting ${presetName} to Gateway...`);
    try {
      await triggerSimulationPreset(presetName);
      if (onDataRefresh) await onDataRefresh();
      setInjectMsg(`Backend updated via Gateway!`);
      setTimeout(() => setInjectMsg(""), 3000);
    } catch {
      setInjectMsg("Failed to inject");
    } finally {
      setInjecting(false);
    }
  };

  const handleSliderCommit = async () => {
    setInjecting(true);
    setInjectMsg(`Updating Node-1 to ${sliderMoisture}%...`);
    try {
      await updateNodeSensor("NODE-1", { soilMoisture: Number(sliderMoisture) });
      if (onDataRefresh) await onDataRefresh();
      setInjectMsg(`Node-1 updated: ${sliderMoisture}%`);
      setTimeout(() => setInjectMsg(""), 3000);
    } catch {
      setInjectMsg("Failed to update node");
    } finally {
      setInjecting(false);
    }
  };

  return (
    <div className="slidebar-backdrop" onClick={onClose}>
      <aside className="slidebar-container" onClick={(e) => e.stopPropagation()}>
        {/* Slidebar Header */}
        <div className="slidebar-header">
          <div className="slidebar-user">
            <div className="slidebar-avatar">RT</div>
            <div className="slidebar-user-info">
              <span className="user-name">Rupesh Thakur</span>
              <span className="farm-name">GreenValley Farm • Sector 4</span>
            </div>
          </div>
          <button className="slidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Live Raspberry Pi Gateway Hardware Badge */}
        <div className="slidebar-gateway-card">
          <div className="gw-card-top">
            <span className="gw-badge-pulse" />
            <span className="gw-model-title">{gateway.model || "Raspberry Pi 4 Gateway"}</span>
          </div>
          <div className="gw-specs-grid">
            <div className="gw-spec-item">
              <Cpu size={13} />
              <span>{gateway.cpuTempC || 43}°C CPU</span>
            </div>
            <div className="gw-spec-item">
              <Wifi size={13} />
              <span>{gateway.loraFrequency || "868 MHz"}</span>
            </div>
            <div className="gw-spec-item">
              <Sun size={13} />
              <span>{gateway.solarVoltage || 13.9}V Solar</span>
            </div>
            <div className="gw-spec-item">
              <span>RAM: {gateway.ramUsage || "28%"}</span>
            </div>
          </div>
          <div className="gw-ip-row">
            <span>IP: {gateway.ip || "192.168.1.108"}</span>
            <span className="gw-uptime">Up: {gateway.uptime || "14 days"}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="slidebar-nav">
          <div className="slidebar-section-label">APPLICATION SCREENS</div>
          <button
            className={`slidebar-nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleNav("home")}
          >
            <Home size={18} />
            <span>Farm Overview</span>
          </button>
          <button
            className={`slidebar-nav-item ${activeTab === "map" ? "active" : ""}`}
            onClick={() => handleNav("map")}
          >
            <Layers size={18} />
            <span>Precision Field Map</span>
          </button>
          <button
            className={`slidebar-nav-item ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => handleNav("ai")}
          >
            <BrainCircuit size={18} />
            <span>AI Agronomy Advisor</span>
          </button>
          <button
            className={`slidebar-nav-item ${activeTab === "control" ? "active" : ""}`}
            onClick={() => handleNav("control")}
          >
            <Zap size={18} />
            <span>Pump & Relays</span>
          </button>
          <button
            className={`slidebar-nav-item ${activeTab === "gateway" ? "active" : ""}`}
            onClick={() => handleNav("gateway")}
          >
            <Radio size={18} />
            <span>Raspberry Pi Console</span>
          </button>
        </nav>

        {/* Live Raspberry Pi Telemetry Injector (Backend Driver) */}
        <div className="slidebar-injector-section">
          <div className="slidebar-section-label">
            <Sliders size={13} />
            <span>GATEWAY TELEMETRY INJECTOR</span>
          </div>
          <p className="injector-desc">
            Test real-time backend recalculation of maps, stress indexes, and AI recommendations.
          </p>

          <div className="injector-slider-box">
            <div className="slider-header">
              <span>Node 1 (Zone A) Moisture</span>
              <span className="slider-val text-green-600 font-bold">{sliderMoisture}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={sliderMoisture}
              onChange={(e) => setSliderMoisture(e.target.value)}
              className="injector-range"
            />
            <button
              className="btn btn--secondary btn--sm w-full mt-1"
              onClick={handleSliderCommit}
              disabled={injecting}
            >
              <Send size={13} /> Inject Moisture to Backend
            </button>
          </div>

          <div className="injector-presets-grid">
            <button
              className="preset-btn preset-drought"
              onClick={() => handlePreset("drought")}
              disabled={injecting}
            >
              <Flame size={14} /> Drought Stress
            </button>
            <button
              className="preset-btn preset-rain"
              onClick={() => handlePreset("rain")}
              disabled={injecting}
            >
              <CloudRain size={14} /> Heavy Rain
            </button>
            <button
              className="preset-btn preset-optimal"
              onClick={() => handlePreset("optimal")}
              disabled={injecting}
            >
              <CheckCircle2 size={14} /> Optimal Farm
            </button>
            <button
              className="preset-btn preset-offline"
              onClick={() => handlePreset("node_offline")}
              disabled={injecting}
            >
              <AlertTriangle size={14} /> Node 2 Offline
            </button>
          </div>

          {injectMsg && <div className="injector-status-msg">{injectMsg}</div>}
        </div>
      </aside>
    </div>
  );
}
