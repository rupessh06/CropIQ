import React from "react";
import { useTranslation } from "react-i18next";
import { Home, Layers, Sliders, BrainCircuit, Radio } from "lucide-react";

export default function BottomNav({ active, onChange }) {
  const { t } = useTranslation();

  const tabs = [
    { id: "home", label: t("home_tab") || "Home", icon: Home },
    { id: "map", label: "Map", icon: Layers },
    { id: "control", label: t("control_tab") || "Control", icon: Sliders },
    { id: "ai", label: "AI Advisor", icon: BrainCircuit },
    { id: "gateway", label: "Pi Gateway", icon: Radio },
  ];

  return (
    <nav className="bottom-nav mobile-bottom-header" role="navigation" aria-label="Main navigation">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`nav-${id}`}
            className={`bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className="bottom-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
