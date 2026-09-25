import { useTranslation } from "react-i18next";
import { Thermometer, Wind, CloudRain, Sun } from "lucide-react";

export default function SensorSummary({ environment, soil }) {
  const { t } = useTranslation();

  const getTempSubtext = (temp) => {
    if (temp > 35) return t("high");
    if (temp < 15) return t("low");
    return t("normal");
  };

  const items = [
    {
      id: "soil-moisture",
      icon: "🌱",
      label: t("soil"),
      value: `${soil.soil_percent}%`,
      subtext: t(soil.soil_status), // Assumes translation keys 'moist', 'dry', 'wet'
    },
    {
      id: "temperature",
      icon: "🌡",
      label: t("temperature"),
      value: `${environment.temperatureC}°C`,
      subtext: getTempSubtext(environment.temperatureC),
    },
    {
      id: "humidity",
      icon: "💧",
      label: t("humidity"),
      value: `${environment.humidityPercent}%`,
      subtext: "",
    },
    {
      id: "rain",
      icon: "🌧",
      label: t("rain"),
      value: environment.rainDetected ? t("rain_detected") : t("no_rain"),
      subtext: "",
    },
  ];

  return (
    <div className="section">
      <h2 className="section-title">{t("temperature")} / {t("humidity")} / {t("rain")}</h2>
      <div className="sensor-grid">
        {items.map((item) => (
          <div key={item.id} id={item.id} className="sensor-item">
            <span className="sensor-item__icon">{item.icon}</span>
            <span className="sensor-item__label">{item.label}</span>
            <span className="sensor-item__value">{item.value}</span>
            {item.subtext && (
              <span className="sensor-item__sub">{item.subtext}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
