import React from "react";
import { useTranslation } from "react-i18next";
import FarmStatus from "../components/FarmStatus";
import WaterStatus from "../components/WaterStatus";
import SensorSummary from "../components/SensorSummary";
import NodeStatus from "../components/NodeStatus";
import CropStatus from "../components/CropStatus";
import AlertCard from "../components/AlertCard";
import FarmMap from "../components/FarmMap";
import AIRecommendations from "../components/AIRecommendations";

export default function Home({ data, onPumpToggle, pumpLoading, onNavChange, onRefresh }) {
  const { t } = useTranslation();
  const {
    farm = {},
    status = {},
    soil = {},
    environment = {},
    pump = {},
    irrigation = {},
    node = {},
    cropProfile = {},
    alerts = [],
    nodes = [],
    recommendations = [],
  } = data;

  const topAlert = alerts[0] || null;

  const handleAlertAction = (action) => {
    if (action === "control") onNavChange("control");
    if (action === "gateway") onNavChange("gateway");
  };

  return (
    <div className="page home-page">
      {/* Farm Health Status Banner */}
      <FarmStatus farm={farm} status={status} />

      {/* Top Urgent Alert if any */}
      {topAlert && (
        <div className="section alert-section-wrap">
          <AlertCard alert={topAlert} onAction={handleAlertAction} />
        </div>
      )}

      {/* Precision Multi-Layer Field Map */}
      <FarmMap
        nodes={nodes}
        pump={pump}
        onPumpToggle={onPumpToggle}
        onRefresh={onRefresh}
      />

      {/* Water & Soil Status + Pump Control */}
      <WaterStatus
        soil={soil}
        pump={pump}
        irrigation={irrigation}
        onPumpToggle={onPumpToggle}
        pumpLoading={pumpLoading}
      />

      {/* Backend Agronomy AI Recommendations */}
      <AIRecommendations
        recommendations={recommendations}
        onPumpToggle={onPumpToggle}
        pump={pump}
      />

      {/* Sensor Microclimate Summary */}
      <SensorSummary environment={environment} soil={soil} />

      {/* Gateway Master Node Telemetry */}
      <NodeStatus node={node} />

      {/* Crop Growth Stage */}
      <CropStatus cropProfile={cropProfile} farm={farm} />
    </div>
  );
}
