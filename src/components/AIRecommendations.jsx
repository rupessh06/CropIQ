import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle,
  Info,
  Droplets,
  ShieldAlert,
  ArrowRight,
  Zap,
  Sparkles,
  Check,
} from "lucide-react";

export default function AIRecommendations({ recommendations = [], onPumpToggle, pump = {} }) {
  const { t } = useTranslation();
  const [executedAction, setExecutedAction] = useState(null);

  const getIcon = (type, category) => {
    if (type === "critical") return <AlertTriangle size={22} className="ai-icon-alert" />;
    if (type === "warning") return <Droplets size={22} className="ai-icon-water" />;
    if (type === "good") return <CheckCircle size={22} className="ai-icon-good" />;
    return <Sparkles size={22} className="ai-icon-info" />;
  };

  const handleAction = async (reco) => {
    if (reco.actionType === "pump_run" || reco.actionType === "pump_pause") {
      if (onPumpToggle) {
        await onPumpToggle();
        setExecutedAction(reco.id);
        setTimeout(() => setExecutedAction(null), 3500);
      }
    } else {
      setExecutedAction(reco.id);
      setTimeout(() => setExecutedAction(null), 3000);
    }
  };

  return (
    <div className="section ai-recommendations-section">
      <div className="section-header-flex">
        <h2 className="section-title">
          <BrainCircuit size={20} className="text-emerald-600" />
          <span>{t("ai_recommendations")}</span>
        </h2>
        <span className="backend-processed-pill">
          <Zap size={12} /> Backend Agronomy Engine
        </span>
      </div>

      <div className="ai-reco-list">
        {recommendations.length === 0 ? (
          <div className="ai-reco-card ai-reco-card--good">
            <div className="ai-reco-badge-icon">
              <CheckCircle size={22} />
            </div>
            <div className="ai-reco-content">
              <h3 className="ai-reco-title">All Farm Parameters in Balance</h3>
              <p className="ai-reco-text">
                Current soil moisture levels and transpiration curves are within optimal thresholds.
              </p>
            </div>
          </div>
        ) : (
          recommendations.map((reco) => {
            const isCompleted = executedAction === reco.id;
            return (
              <div key={reco.id} className={`ai-reco-card ai-reco-card--${reco.type}`}>
                <div className="ai-reco-card__top">
                  <div className="ai-reco-badge-icon">
                    {getIcon(reco.type, reco.category)}
                  </div>
                  <div className="ai-reco-meta">
                    <span className="ai-reco-category">{reco.category || "Agronomy Insight"}</span>
                    <span className="ai-confidence-tag">
                      {reco.confidence || 95}% Confidence
                    </span>
                  </div>
                </div>

                <div className="ai-reco-content">
                  <h3 className="ai-reco-title">{reco.title}</h3>
                  <p className="ai-reco-text">{reco.text}</p>

                  {reco.details && (
                    <div className="ai-reco-details-box">
                      <span className="details-header">Agronomic Reasoning:</span>
                      <p className="details-body">{reco.details}</p>
                    </div>
                  )}

                  {reco.actionLabel && (
                    <div className="ai-reco-action-row">
                      <button
                        className={`ai-action-btn ${isCompleted ? "action-done" : ""}`}
                        onClick={() => handleAction(reco)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? (
                          <>
                            <Check size={16} /> Command Executed
                          </>
                        ) : (
                          <>
                            <span>{reco.actionLabel}</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
