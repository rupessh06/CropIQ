import { useTranslation } from "react-i18next";
import { Droplets, CloudRain } from "lucide-react";

export default function WaterStatus({ soil, pump, irrigation, onPumpToggle, pumpLoading }) {
  const { t } = useTranslation();

  const soilConfig = {
    dry: { label: t("dry"), className: "water-status--dry", barClass: "soil-bar--dry" },
    moist: { label: t("moist"), className: "water-status--moist", barClass: "soil-bar--moist" },
    wet: { label: t("wet"), className: "water-status--wet", barClass: "soil-bar--wet" },
  };

  const cfg = soilConfig[soil.soil_status] || soilConfig.moist;
  const pumpOn = pump.isOn;

  return (
    <div className="section">
      <h2 className="section-title">
        <Droplets size={20} strokeWidth={2} />
        {t("water_need")}
      </h2>

      <div className={`water-status-card ${cfg.className}`}>
        <div className="water-status-card__top">
          <div>
            <span className="water-label">{t("soil")}</span>
            <span className="water-value">{cfg.label}</span>
          </div>
          <div className="soil-percent">
            <span className="soil-percent__number">{soil.soil_percent}</span>
            <span className="soil-percent__unit">%</span>
          </div>
        </div>

        <div className="soil-bar-track" role="progressbar" aria-valuenow={soil.soil_percent} aria-valuemin={0} aria-valuemax={100}>
          <div className={`soil-bar-fill ${cfg.barClass}`} style={{ width: `${soil.soil_percent}%` }} />
        </div>
        <p className="soil-bar-note">{t("estimated_moisture")}</p>

        <div className="rain-row">
          <CloudRain size={16} />
          <span>{soil.rainDetected ? t("rain_detected") : t("no_rain")}</span>
        </div>
      </div>

      {irrigation.irrigationNeeded && (
        <p className="irrigation-hint">{t("water_may_be_needed")}</p>
      )}

      <div className="pump-control">
        <div className="pump-status-row">
          <span className={`pump-dot ${pumpOn ? "pump-dot--on" : "pump-dot--off"}`} />
          <span className="pump-status-text">
            {pumpOn ? t("pump_running") : t("pump_off")}
          </span>
        </div>

        <button
          id={pumpOn ? "btn-stop-pump" : "btn-start-irrigation"}
          className={`btn btn--full ${pumpOn ? "btn--danger" : "btn--primary"}`}
          onClick={onPumpToggle}
          disabled={pumpLoading}
          aria-label={pumpOn ? t("stop_pump") : t("start_irrigation")}
        >
          {pumpLoading
            ? t("sending_command")
            : pumpOn
            ? t("stop_pump")
            : t("start_irrigation")}
        </button>
      </div>
    </div>
  );
}
