import { useTranslation } from "react-i18next";
import { Leaf, Battery, Sun, Clock, Wifi, ChevronRight } from "lucide-react";

const CROP_OPTIONS = [
  { id: "tomato", label: "Tomato", emoji: "🍅" },
  { id: "rice", label: "Rice", emoji: "🌾" },
  { id: "wheat", label: "Wheat", emoji: "🌾" },
  { id: "potato", label: "Potato", emoji: "🥔" },
  { id: "maize", label: "Maize", emoji: "🌽" },
];

export default function Farm({ data, onCropChange }) {
  const { t } = useTranslation();
  const { farm, node, cropProfile, status } = data;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t("my_farm")}</h1>
      </div>

      <div className="section">
        <h2 className="section-title">
          <Leaf size={20} strokeWidth={2} />
          {t("farm_details")}
        </h2>
        <div className="info-list">
          <div className="info-row">
            <span className="info-row__label">Farm name</span>
            <span className="info-row__value">{farm.name}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Location</span>
            <span className="info-row__value">{farm.location}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Crop</span>
            <span className="info-row__value">{farm.crop}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{t("crop_status")}</h2>
        <div className="info-list">
          <div className="info-row">
            <span className="info-row__label">Crop</span>
            <span className="info-row__value">{cropProfile.crop}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Status</span>
            <span className="info-row__value info-row__value--green">{t("active")}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">{t("water_need")}</span>
            <span className="info-row__value">{t(cropProfile.waterNeed.toLowerCase())}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">{t("temperature")}</span>
            <span className="info-row__value">{t(cropProfile.temperatureSuitability.toLowerCase())}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{t("sensor_node")}</h2>
        <div className="info-list">
          <div className="info-row">
            <span className="info-row__label">Node</span>
            <span className="info-row__value">{node.name}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Status</span>
            <span className={`info-row__value ${node.online ? "info-row__value--green" : "info-row__value--red"}`}>
              {node.online ? t("online") : t("offline")}
            </span>
          </div>
          <div className="info-row">
            <span className="info-row__label">{t("battery")}</span>
            <span className={`info-row__value ${node.batteryPercent < 25 ? "info-row__value--red" : ""}`}>
              {node.batteryPercent}%
              {node.batteryPercent < 25 && ` — ${t("low_battery")}`}
            </span>
          </div>
          <div className="info-row">
            <span className="info-row__label">{t("solar")}</span>
            <span className="info-row__value">{node.solarCharging ? t("charging") : t("idle")}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{t("select_crop")}</h2>
        <div className="crop-grid">
          {CROP_OPTIONS.map((c) => (
            <button
              key={c.id}
              id={`btn-crop-${c.id}`}
              className={`crop-btn${farm.cropType === c.id ? " crop-btn--active" : ""}`}
              onClick={() => onCropChange(c.id)}
              aria-pressed={farm.cropType === c.id}
            >
              <span className="crop-btn__emoji">{c.emoji}</span>
              <span className="crop-btn__label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">{t("plant_scan")}</h2>
        <div className="coming-soon-card">
          <span className="coming-soon-badge">{t("coming_soon")}</span>
          <p className="coming-soon-text">
            Scan a plant to detect possible disease or health issues. Your photo is processed locally on your farm gateway.
          </p>
          <button id="btn-scan-plant" className="btn btn--outline btn--full" disabled>
            📷 {t("plant_scan")}
          </button>
        </div>
      </div>
    </div>
  );
}
