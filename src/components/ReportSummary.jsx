import { useTranslation } from "react-i18next";
import { BarChart2 } from "lucide-react";

export default function ReportSummary({ today, weekly }) {
  const { t } = useTranslation();

  const todayRows = [
    { label: t("soil"), value: t(today.soilStatus.toLowerCase()) },
    { label: t("temperature"), value: t(today.temperatureStatus.toLowerCase()) },
    { label: t("rain"), value: t(today.rainStatus.toLowerCase()) || today.rainStatus },
    { label: "Irrigation", value: `${today.irrigationMinutes} ${t("minutes")}` },
    { label: "Crop status", value: t(today.cropStatus.toLowerCase()) },
  ];

  const weeklyRows = [
    { label: "Watering", value: `${weekly.wateringCount} times` },
    { label: "Avg temperature", value: `${weekly.averageTemperatureC}°C` },
    { label: "Rain events", value: `${weekly.rainEvents} events` },
    { label: "Crop condition", value: t(weekly.cropCondition.toLowerCase()) },
  ];

  return (
    <>
      <div className="section">
        <h2 className="section-title">
          <BarChart2 size={20} strokeWidth={2} />
          {t("today")}
        </h2>
        <div className="report-table">
          {todayRows.map((r) => (
            <div key={r.label} className="report-row">
              <span className="report-row__label">{r.label}</span>
              <span className="report-row__value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">{t("this_week")}</h2>
        <div className="report-table">
          {weeklyRows.map((r) => (
            <div key={r.label} className="report-row">
              <span className="report-row__label">{r.label}</span>
              <span className="report-row__value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
