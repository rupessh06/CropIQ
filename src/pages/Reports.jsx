import { useTranslation } from "react-i18next";
import ReportSummary from "../components/ReportSummary";
import { mockHistory } from "../data/mockData";

function HistoryEntry({ entry }) {
  const { t } = useTranslation();
  return (
    <div className="history-entry">
      <span className="history-entry__time">{entry.time}</span>
      <div className="history-entry__detail">
        <span className="history-entry__event">{entry.event}</span>
        {entry.duration && (
          <span className="history-entry__duration">{entry.duration}</span>
        )}
      </div>
      <span className={`history-entry__pump ${entry.pumpStatus === "ON" ? "history-pump--on" : "history-pump--off"}`}>
        {entry.pumpStatus === "ON" ? t("pump_running") : t("pump_off")}
      </span>
    </div>
  );
}

export default function Reports({ data }) {
  const { t } = useTranslation();
  const { today, weekly } = data;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t("reports")}</h1>
      </div>

      <ReportSummary today={today} weekly={weekly} />

      <div className="section">
        <h2 className="section-title">{t("history")}</h2>
        {mockHistory.map((day) => (
          <div key={day.date} className="history-day">
            <h3 className="history-day__label">{day.date}</h3>
            {day.entries.map((entry, i) => (
              <HistoryEntry key={i} entry={entry} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
