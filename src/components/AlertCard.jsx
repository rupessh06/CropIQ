import { AlertTriangle, ChevronRight } from "lucide-react";

export default function AlertCard({ alert, onAction }) {
  if (!alert) return null;
  return (
    <div className={`alert-card alert-card--${alert.severity}`} role="alert">
      <AlertTriangle size={20} strokeWidth={2.2} />
      <div className="alert-card__body">
        <p className="alert-card__title">{alert.title}</p>
        <p className="alert-card__message">{alert.message}</p>
        {alert.actionLabel && (
          <button
            id={`alert-action-${alert.id}`}
            className="alert-card__action"
            onClick={() => onAction && onAction(alert.action)}
          >
            {alert.actionLabel} <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
