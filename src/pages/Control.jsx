import { useTranslation } from "react-i18next";
import PumpControl from "../components/PumpControl";
import IrrigationSchedule from "../components/IrrigationSchedule";
import { ToggleLeft, ToggleRight, Info } from "lucide-react";

export default function Control({ data, onPumpToggle, pumpLoading, commandStatus, onScheduleAdd, onScheduleUpdate, onScheduleDelete, onSmartIrrigationToggle }) {
  const { t } = useTranslation();
  const { farm, pump, irrigation } = data;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t("farm_control")}</h1>
      </div>

      <PumpControl
        pump={pump}
        farm={farm}
        onToggle={onPumpToggle}
        loading={pumpLoading}
        commandStatus={commandStatus}
      />

      <div className="section">
        <h2 className="section-title">{t("smart_irrigation")}</h2>
        <div className="smart-irr-card">
          <div className="smart-irr-top">
            <div>
              <p className="smart-irr-name">{t("smart_irrigation")}</p>
              <p className="smart-irr-state">
                {irrigation.smartIrrigationEnabled ? "ON" : "OFF"}
              </p>
            </div>
            <button
              id="btn-smart-irrigation-toggle"
              className="toggle-btn"
              onClick={() => onSmartIrrigationToggle(!irrigation.smartIrrigationEnabled)}
              aria-label={`Smart irrigation is ${irrigation.smartIrrigationEnabled ? "on" : "off"}, tap to toggle`}
              aria-pressed={irrigation.smartIrrigationEnabled}
            >
              {irrigation.smartIrrigationEnabled
                ? <ToggleRight size={44} color="var(--green-600)" strokeWidth={1.5} />
                : <ToggleLeft size={44} color="var(--grey-300)" strokeWidth={1.5} />
              }
            </button>
          </div>
          <p className="smart-irr-desc">
            CropIQ can recommend or automatically start irrigation based on crop and field conditions.
          </p>

          {irrigation.smartIrrigationEnabled && (
            <div className="smart-irr-limit">
              <Info size={14} color="var(--green-600)" />
              <span>{t("max_irrigation")}: <strong>{irrigation.maxDurationMinutes} {t("minutes")}</strong></span>
            </div>
          )}
        </div>
      </div>

      <IrrigationSchedule
        schedules={irrigation.schedules}
        onAdd={onScheduleAdd}
        onUpdate={onScheduleUpdate}
        onDelete={onScheduleDelete}
      />
    </div>
  );
}
