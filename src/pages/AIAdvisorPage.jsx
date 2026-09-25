import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrainCircuit,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import AIRecommendations from "../components/AIRecommendations";

export default function AIAdvisorPage({ data = {}, onPumpToggle }) {
  const { farm = {}, status = {}, soil = {}, environment = {}, recommendations = [], pump = {} } = data;

  return (
    <div className="page ai-advisor-page">
      <div className="section">
        <div className="section-header-flex">
          <div>
            <h1 className="page-heading-main">
              <BrainCircuit size={22} className="text-emerald-600 inline mr-2" />
              AI Agronomy Advisor
            </h1>
            <p className="page-heading-sub">
              Real-time crop water stress &amp; disease intelligence
            </p>
          </div>
          <span className="ai-badge-live">
            <Zap size={13} /> Active Model
          </span>
        </div>

        {/* Agronomy Key Indexes */}
        <div className="advisor-kpi-grid">
          <div className="advisor-kpi-card">
            <span className="kpi-label">Farm Health Index</span>
            <div className="kpi-value-row">
              <span className="kpi-number text-green-600">{status.healthScore || 92}%</span>
            </div>
            <span className="kpi-status-sub">
              {status.overallStatus === "good" ? "Balanced Hydration" : "Action Needed"}
            </span>
          </div>

          <div className="advisor-kpi-card">
            <span className="kpi-label">Crop Water Deficit</span>
            <div className="kpi-value-row">
              <span className="kpi-number text-blue-600">
                {soil.moisture < 45 ? `${(45 - soil.moisture).toFixed(0)}%` : "0%"}
              </span>
            </div>
            <span className="kpi-status-sub">
              {soil.moisture < 45 ? "Root depletion detected" : "Optimal root water"}
            </span>
          </div>

          <div className="advisor-kpi-card">
            <span className="kpi-label">Evaporation Rate (ET0)</span>
            <div className="kpi-value-row">
              <span className="kpi-number">
                {environment.temperatureC > 30 ? "High (4.8mm/d)" : "Moderate (3.1mm/d)"}
              </span>
            </div>
            <span className="kpi-status-sub">
              {environment.temperatureC > 30 ? "Irrigate after 17:00" : "Safe to drip now"}
            </span>
          </div>

          <div className="advisor-kpi-card">
            <span className="kpi-label">Fungal Spore Risk</span>
            <div className="kpi-value-row">
              <span className="kpi-number text-amber-500">
                {environment.humidityPercent > 65 ? "Elevated" : "Low Risk"}
              </span>
            </div>
            <span className="kpi-status-sub">
              {environment.humidityPercent}% RH at {environment.temperatureC}°C
            </span>
          </div>
        </div>
      </div>

      {/* Backend Processed Recommendations */}
      <AIRecommendations recommendations={recommendations} onPumpToggle={onPumpToggle} pump={pump} />

      {/* Best Agronomic Practices Card */}
      <div className="section">
        <h2 className="section-title">
          <ShieldCheck size={18} /> Best Agronomy Practices
        </h2>
        <div className="agronomy-guide-card">
          <div className="guide-item">
            <Clock size={18} className="text-blue-500" />
            <div>
              <h4>Target Watering Window</h4>
              <p>For tomato flowering stage, early morning (05:30 - 07:00) or late afternoon (17:00 - 18:30) drip irrigation delivers 30% higher root absorption than midday application.</p>
            </div>
          </div>
          <div className="guide-item mt-3">
            <Droplets size={18} className="text-emerald-500" />
            <div>
              <h4>Subsoil Moisture Check</h4>
              <p>Maintaining subsoil (30cm depth) between 50-60% promotes deep taproot development, making crops resilient against unexpected temperature spikes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
