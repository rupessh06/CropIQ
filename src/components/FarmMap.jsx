import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Layers,
  Droplets,
  Thermometer,
  Sparkles,
  Radio,
  Battery,
  Wifi,
  ChevronRight,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  SunMedium,
} from "lucide-react";

export default function FarmMap({ nodes = [], pump = {}, onPumpToggle, onRefresh }) {
  const { t } = useTranslation();
  const [activeLayer, setActiveLayer] = useState("moisture"); // "moisture" | "thermal" | "ndvi" | "parcels"
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Color generator for multi-layer heatmaps
  const getNodeColor = (node, layer) => {
    if (!node.active) return "rgba(156, 163, 175, 0.4)"; // Offline gray

    if (layer === "moisture") {
      const m = node.soilMoisture;
      if (m < 32) return "rgba(239, 68, 68, 0.75)"; // Severe Dry (Crimson)
      if (m < 42) return "rgba(245, 158, 11, 0.75)"; // Warning Dry (Amber)
      if (m <= 68) return "rgba(16, 185, 129, 0.75)"; // Lush Optimal (Emerald)
      if (m <= 78) return "rgba(6, 182, 212, 0.75)"; // High Moisture (Cyan)
      return "rgba(37, 99, 235, 0.75)"; // Waterlogged (Deep Blue)
    }

    if (layer === "thermal") {
      const temp = node.ambientTemp || 30;
      if (temp < 24) return "rgba(6, 182, 212, 0.75)"; // Cool (Cyan)
      if (temp < 28) return "rgba(34, 197, 94, 0.75)"; // Optimal (Green)
      if (temp < 33) return "rgba(234, 179, 8, 0.75)"; // Warm (Yellow)
      return "rgba(239, 68, 68, 0.85)"; // Heat stress (Red)
    }

    if (layer === "ndvi") {
      const m = node.soilMoisture;
      if (m < 32) return "rgba(217, 119, 6, 0.75)"; // Low vigor
      if (m < 48) return "rgba(132, 204, 22, 0.75)"; // Moderate
      return "rgba(21, 128, 61, 0.85)"; // Dense healthy foliage
    }

    return "rgba(59, 130, 246, 0.6)";
  };

  // Build the dynamic multi-radial composite heatmap background
  const heatmapGradients = nodes
    .map((node) => {
      const color = getNodeColor(node, activeLayer);
      return `radial-gradient(circle at ${node.x}% ${node.y}%, ${color} 0%, transparent 48%)`;
    })
    .join(", ");

  return (
    <div className="section precision-map-section">
      <div className="section-header-flex">
        <h2 className="section-title">
          <Layers size={20} className="text-green-600" />
          {t("farm_condition_map")}
        </h2>
        <button
          onClick={handleRefresh}
          className={`map-refresh-btn ${isRefreshing ? "spin" : ""}`}
          title="Sync with Raspberry Pi Gateway"
          aria-label="Refresh gateway telemetry"
        >
          <RefreshCw size={15} />
          <span>Sync Gateway</span>
        </button>
      </div>

      {/* Layer Switcher Tabs */}
      <div className="map-layer-selector">
        <button
          className={`map-layer-pill ${activeLayer === "moisture" ? "active" : ""}`}
          onClick={() => setActiveLayer("moisture")}
        >
          <Droplets size={14} />
          <span>Soil Moisture</span>
        </button>
        <button
          className={`map-layer-pill ${activeLayer === "thermal" ? "active" : ""}`}
          onClick={() => setActiveLayer("thermal")}
        >
          <Thermometer size={14} />
          <span>Canopy Heat</span>
        </button>
        <button
          className={`map-layer-pill ${activeLayer === "ndvi" ? "active" : ""}`}
          onClick={() => setActiveLayer("ndvi")}
        >
          <Sparkles size={14} />
          <span>Crop Vigor (NDVI)</span>
        </button>
        <button
          className={`map-layer-pill ${activeLayer === "parcels" ? "active" : ""}`}
          onClick={() => setActiveLayer("parcels")}
        >
          <Radio size={14} />
          <span>LoRa Network</span>
        </button>
      </div>

      {/* Main Precision Map Frame */}
      <div className="precision-map-viewport">
        {/* Agricultural Field Grid Lines & Crop Texture */}
        <div className="farm-cadastral-grid">
          <div className="field-parcel parcel-zone-a">
            <span className="parcel-tag">Zone A • Tomato</span>
          </div>
          <div className="field-parcel parcel-zone-b">
            <span className="parcel-tag">Zone B • Polyhouse</span>
          </div>
          <div className="field-parcel parcel-zone-c">
            <span className="parcel-tag">Zone C • Orchard</span>
          </div>
          <div className="field-parcel parcel-zone-d">
            <span className="parcel-tag">Zone D • Nursery</span>
          </div>
        </div>

        {/* Dynamic Heatmap Diffusion Layer */}
        {activeLayer !== "parcels" && (
          <div
            className="precision-heatmap-mesh"
            style={{
              background: heatmapGradients,
              opacity: activeLayer === "moisture" ? 0.88 : 0.8,
            }}
          />
        )}

        {/* Irrigation Pipeline Overlay with Live Flow Pulse */}
        <svg className="farm-pipes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          {/* Main Drip Line from Central Station */}
          <path
            d="M 50 50 L 28 28 M 50 50 L 74 28 M 50 50 L 28 74 M 50 50 L 74 74"
            className={`irrigation-pipe ${pump?.isOn ? "pipe-active" : ""}`}
          />
        </svg>

        {/* Central Raspberry Pi Gateway Mast */}
        <div className="pi-gateway-station" title="Raspberry Pi Master LoRa Gateway">
          <div className="gateway-tower-icon">
            <Radio size={18} />
          </div>
          <div className="gateway-pulse-ring" />
          {pump?.isOn && <div className="gateway-water-flow-badge">Pump ON</div>}
        </div>

        {/* Field Sensor Nodes (Interactive Pins) */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isDry = node.soilMoisture < 35;
          return (
            <button
              key={node.id}
              className={`field-sensor-marker ${node.active ? "node-live" : "node-offline"} ${
                isDry ? "node-stress" : ""
              } ${isSelected ? "node-selected" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setSelectedNode(node)}
              aria-label={`Inspect ${node.name}`}
            >
              <div className="marker-dot" style={{ backgroundColor: getNodeColor(node, activeLayer) }} />
              <div className="marker-badge">
                <span className="marker-val">
                  {activeLayer === "thermal"
                    ? `${node.ambientTemp}°`
                    : activeLayer === "ndvi"
                    ? (0.4 + (node.soilMoisture / 100) * 0.4).toFixed(2)
                    : `${Math.round(node.soilMoisture)}%`}
                </span>
              </div>
              <span className="marker-zone-pill">{node.zone || node.id}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Map Legend */}
      <div className="map-legend-bar">
        {activeLayer === "moisture" && (
          <>
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#ef4444" }} />
              <span>Dry (&lt;32%)</span>
            </div>
            <div className="legend-bar-moisture" />
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#10b981" }} />
              <span>Optimal (45-65%)</span>
            </div>
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#2563eb" }} />
              <span>Wet (&gt;75%)</span>
            </div>
          </>
        )}

        {activeLayer === "thermal" && (
          <>
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#06b6d4" }} />
              <span>Cool 22°C</span>
            </div>
            <div className="legend-bar-thermal" />
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#eab308" }} />
              <span>30°C</span>
            </div>
            <div className="legend-label-col">
              <span className="legend-dot" style={{ background: "#ef4444" }} />
              <span>Heat Stress 36°C</span>
            </div>
          </>
        )}

        {activeLayer === "ndvi" && (
          <>
            <div className="legend-label-col">
              <span>0.3 Sparse</span>
            </div>
            <div className="legend-bar-ndvi" />
            <div className="legend-label-col">
              <span>0.85 Lush Canopy</span>
            </div>
          </>
        )}

        {activeLayer === "parcels" && (
          <div className="legend-parcels-info">
            <span className="legend-bullet-item">
              <span className="bullet-dot bullet-gateway" /> Raspberry Pi Master Gateway
            </span>
            <span className="legend-bullet-item">
              <span className="bullet-dot bullet-node" /> 4 Active LoRa Nodes
            </span>
            <span className="legend-bullet-item">
              <span className="bullet-dot bullet-pipe" /> Drip Line ({pump?.isOn ? "Water Flowing" : "Idle"})
            </span>
          </div>
        )}
      </div>

      {/* Quick Zone Health Strip */}
      <div className="map-zones-strip">
        {nodes.map((node) => {
          const isStressed = node.soilMoisture < 38;
          return (
            <div
              key={node.id}
              className={`zone-mini-card ${isStressed ? "zone-mini-card--alert" : ""}`}
              onClick={() => setSelectedNode(node)}
            >
              <div className="zone-mini-header">
                <span className="zone-mini-tag">{node.zone || node.id}</span>
                <span className={`status-pill ${node.active ? "status-pill--good" : "status-pill--bad"}`}>
                  {node.active ? "Online" : "Off"}
                </span>
              </div>
              <div className="zone-mini-crop">{node.crop || "Crops"}</div>
              <div className="zone-mini-stats">
                <div className="zone-stat-col">
                  <span className="zone-stat-sub">Moisture</span>
                  <span className={`zone-stat-num ${isStressed ? "text-amber-500 font-bold" : ""}`}>
                    {Math.round(node.soilMoisture)}%
                  </span>
                </div>
                <div className="zone-stat-col">
                  <span className="zone-stat-sub">Temp</span>
                  <span className="zone-stat-num">{node.soilTemp}°C</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Modal / Bottom Sheet */}
      {selectedNode && (
        <div className="node-detail-sheet-backdrop" onClick={() => setSelectedNode(null)}>
          <div className="node-detail-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="sheet-title-group">
                <div className="sheet-badge">
                  <Radio size={16} />
                  <span>{selectedNode.id}</span>
                </div>
                <h3>{selectedNode.name}</h3>
                <span className="sheet-subtitle">
                  {selectedNode.zone} • {selectedNode.crop}
                </span>
              </div>
              <button
                className="sheet-close-btn"
                onClick={() => setSelectedNode(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="sheet-grid">
              <div className="sheet-stat-box highlight">
                <span className="sheet-stat-label">Root Moisture (10cm)</span>
                <span className="sheet-stat-val text-green-600">
                  {selectedNode.soilMoisture}%
                </span>
                <div className="sheet-progress-bar">
                  <div
                    className="sheet-progress-fill"
                    style={{
                      width: `${Math.min(100, selectedNode.soilMoisture)}%`,
                      backgroundColor: selectedNode.soilMoisture < 35 ? "#ef4444" : "#10b981",
                    }}
                  />
                </div>
                <span className="sheet-stat-sub">
                  Target: 45-65% • {selectedNode.soilMoisture < 35 ? "Depleted" : "Healthy"}
                </span>
              </div>

              <div className="sheet-stat-box">
                <span className="sheet-stat-label">Subsoil Moisture (30cm)</span>
                <span className="sheet-stat-val">{selectedNode.soilMoistureDeep || 38}%</span>
                <span className="sheet-stat-sub">Deep root reservoir</span>
              </div>

              <div className="sheet-stat-box">
                <span className="sheet-stat-label">Soil Temperature</span>
                <span className="sheet-stat-val">{selectedNode.soilTemp}°C</span>
                <span className="sheet-stat-sub">Normal root zone</span>
              </div>

              <div className="sheet-stat-box">
                <span className="sheet-stat-label">Air Temp / Humidity</span>
                <span className="sheet-stat-val">
                  {selectedNode.ambientTemp}°C / {selectedNode.ambientHumidity}%
                </span>
                <span className="sheet-stat-sub">Microclimate sensor</span>
              </div>

              <div className="sheet-stat-box">
                <span className="sheet-stat-label">Sunlight Index</span>
                <span className="sheet-stat-val">
                  {(selectedNode.sunlightLux / 1000).toFixed(0)}k Lux
                </span>
                <span className="sheet-stat-sub">Active photosynthesis</span>
              </div>

              <div className="sheet-stat-box">
                <span className="sheet-stat-label">Hardware Health</span>
                <div className="sheet-hw-row">
                  <span className="hw-chip">
                    <Battery size={13} /> {selectedNode.battery}%
                  </span>
                  <span className="hw-chip">
                    <Wifi size={13} /> {selectedNode.signalDbm || -68} dBm
                  </span>
                </div>
                <span className="sheet-stat-sub">Solar recharged</span>
              </div>
            </div>

            <div className="sheet-actions">
              <button
                className={`btn btn--full ${pump?.isOn ? "btn--danger" : "btn--primary"}`}
                onClick={() => {
                  if (onPumpToggle) onPumpToggle();
                  setSelectedNode(null);
                }}
              >
                {pump?.isOn ? "Stop Irrigation Pump" : `Irrigate ${selectedNode.zone} Now`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
