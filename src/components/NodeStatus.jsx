import { useTranslation } from "react-i18next";
import { Battery, Sun, Wifi, WifiOff, Clock } from "lucide-react";

function BatteryIcon({ percent }) {
  const color = percent > 50 ? "#2d7a3a" : percent > 20 ? "#c97a00" : "#c0392b";
  return (
    <span className="battery-icon" aria-hidden="true">
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <rect x="0.5" y="0.5" width="24" height="13" rx="2.5" stroke={color} strokeWidth="1.2" />
        <rect x="1" y="1" width={Math.max(1, (22 * percent) / 100)} height="12" rx="1.5" fill={color} />
        <rect x="25" y="4" width="2.5" height="6" rx="1" fill={color} />
      </svg>
    </span>
  );
}

export default function NodeStatus({ node }) {
  const { t } = useTranslation();
  const batteryLow = node.batteryPercent < 25;
  const batteryClass = node.batteryPercent > 50
    ? "battery--good"
    : node.batteryPercent > 20
    ? "battery--warn"
    : "battery--low";

  return (
    <div className="section">
      <h2 className="section-title">{t("node_status")}</h2>
      <div className="node-card">
        <div className="node-card__row">
          <span className="node-card__name">
            {node.online ? (
              <><span className="status-dot status-dot--green" />{node.name}</>
            ) : (
              <><span className="status-dot status-dot--grey" />{node.name}</>
            )}
          </span>
          <span className={`node-tag ${node.online ? "node-tag--online" : "node-tag--offline"}`}>
            {node.online ? t("online") : t("offline")}
          </span>
        </div>

        <div className="node-stats">
          <div className={`node-stat ${batteryClass}`}>
            <BatteryIcon percent={node.batteryPercent} />
            <div className="node-stat__info">
              <span className="node-stat__value">
                {node.batteryPercent}%
                {batteryLow && <span className="battery-warn-tag">{t("low_battery")}</span>}
              </span>
              <span className="node-stat__label">{t("battery")}</span>
            </div>
          </div>

          <div className="node-stat">
            <Sun size={22} strokeWidth={1.8} color={node.solarCharging ? "#c97a00" : "#aaa"} />
            <div className="node-stat__info">
              <span className="node-stat__value">
                {node.solarCharging ? t("charging") : t("idle")}
              </span>
              <span className="node-stat__label">{t("solar")}</span>
            </div>
          </div>

          <div className="node-stat">
            <Clock size={20} strokeWidth={1.8} color="#666" />
            <div className="node-stat__info">
              <span className="node-stat__value">{node.lastCommunicationLabel}</span>
              <span className="node-stat__label">{t("last_update")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
