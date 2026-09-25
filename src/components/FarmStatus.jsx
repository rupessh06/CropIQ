import { useTranslation } from "react-i18next";
import { CheckCircle, AlertTriangle, AlertCircle, Wifi, WifiOff } from "lucide-react";

const statusConfig = {
  good: {
    icon: CheckCircle,
    className: "farm-status--good",
    dotClass: "status-dot--green",
    langKey: "farm_looks_good"
  },
  needs_attention: {
    icon: AlertTriangle,
    className: "farm-status--warn",
    dotClass: "status-dot--amber",
    langKey: "needs_attention"
  },
  alert: {
    icon: AlertCircle,
    className: "farm-status--alert",
    dotClass: "status-dot--red",
    langKey: "needs_attention"
  },
};

export default function FarmStatus({ farm, status }) {
  const { t } = useTranslation();
  const cfg = statusConfig[status.overallStatus] || statusConfig.good;
  const Icon = cfg.icon;

  return (
    <div className="section">
      <div className="farm-header">
        <div className="farm-header__info">
          <h1 className="farm-header__name">{farm.name}</h1>
          <div className={`connection-badge ${status.farmOnline ? "connection-badge--online" : "connection-badge--offline"}`}>
            {status.farmOnline ? (
              <><span className={`status-dot ${cfg.dotClass}`} /><Wifi size={13} /> {t("farm_online")}</>
            ) : (
              <><span className="status-dot status-dot--grey" /><WifiOff size={13} /> {t("offline")}</>
            )}
          </div>
        </div>
        <div className="farm-header__crop-badge">
          <span className="crop-label">{farm.crop}</span>
        </div>
      </div>

      <div className={`overall-status ${cfg.className}`}>
        <Icon size={28} strokeWidth={2} />
        <span className="overall-status__text">{t(cfg.langKey)}</span>
      </div>

      {!status.farmOnline && (
        <div className="offline-notice">
          <WifiOff size={16} />
          <p>Your farm connection is currently unavailable. {t("last_update")}: {status.lastUpdatedLabel || "a few minutes ago"}.<br />
          Your farm gateway continues to operate locally.</p>
        </div>
      )}
    </div>
  );
}
