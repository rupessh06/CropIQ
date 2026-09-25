import React from "react";
import FarmMap from "../components/FarmMap";

export default function FarmMapPage({ data = {}, onPumpToggle, onRefresh }) {
  const { nodes = [], pump = {} } = data;

  return (
    <div className="page farm-map-page">
      <FarmMap
        nodes={nodes}
        pump={pump}
        onPumpToggle={onPumpToggle}
        onRefresh={onRefresh}
      />
    </div>
  );
}
