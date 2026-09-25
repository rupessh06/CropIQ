import { useTranslation } from "react-i18next";
import { Power, MapPin } from "lucide-react";

export default function PumpControl({ pump, farm, onToggle, loading, commandStatus }) {
  const { t } = useTranslation();
  const pumpOn = pump.isOn;

  return (
    <div className="section">
      <div className="pump-control-header">
        <MapPin size={16} color="var(--grey-500)" />
        <span className="pump-control-distance">
          Your farm is {farm.distanceKm} km away
        </span>
      </div>

      <div className="pump-big-status">
        <span className={`pump-big-dot ${pumpOn ? "pump-big-dot--on" : "pump-big-dot--off"}`} />
        <div>
          <p className="pump-big-label">{t("pump_status")}</p>
          <p className={`pump-big-state ${pumpOn ? "pump-big-state--on" : ""}`}>
            {pumpOn ? t("pump_running") : t("pump_off")}
          </p>
        </div>
      </div>

      {commandStatus && (
        <div className="command-status" role="status" aria-live="polite">
          {commandStatus}
        </div>
      )}

      <button
        id={pumpOn ? "btn-pump-off" : "btn-pump-on"}
        className={`btn btn--full ${pumpOn ? "btn--danger" : "btn--primary"}`}
        onClick={onToggle}
        disabled={loading}
        aria-label={pumpOn ? t("stop_pump") : t("start_irrigation")}
      >
        <Power size={20} strokeWidth={2} />
        {loading ? t("sending_command") : pumpOn ? t("stop_pump") : t("start_irrigation")}
      </button>
    </div>
  );
}
