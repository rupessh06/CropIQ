import { useTranslation } from "react-i18next";
import { Leaf } from "lucide-react";

export default function CropStatus({ cropProfile, farm }) {
  const { t } = useTranslation();

  return (
    <div className="section">
      <h2 className="section-title">
        <Leaf size={20} strokeWidth={2} />
        {t("crop_status")}
      </h2>
      <div className="crop-card">
        <div className="crop-card__header">
          <span className="crop-card__name">{cropProfile.crop}</span>
          <span className={`crop-condition crop-condition--${cropProfile.currentCondition.toLowerCase()}`}>
            {t(cropProfile.currentCondition.toLowerCase())}
          </span>
        </div>
        <div className="crop-details">
          <div className="crop-detail">
            <span className="crop-detail__label">CropIQ Profile</span>
            <span className="crop-detail__value">{cropProfile.profile}</span>
          </div>
          <div className="crop-detail">
            <span className="crop-detail__label">{t("water_need")}</span>
            <span className="crop-detail__value">{t(cropProfile.waterNeed.toLowerCase())}</span>
          </div>
          <div className="crop-detail">
            <span className="crop-detail__label">{t("temperature")}</span>
            <span className="crop-detail__value">{t(cropProfile.temperatureSuitability.toLowerCase())}</span>
          </div>
          {farm.growthStage && (
            <div className="crop-detail">
              <span className="crop-detail__label">Growth stage</span>
              <span className="crop-detail__value">{farm.growthStage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
