import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Globe, Menu, Radio, Sparkles } from "lucide-react";

export default function ThemeLangHeader({ onOpenSlideBar, gateway = {} }) {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("cropiq_lang", lang);
  };

  return (
    <header className="mobile-app-header">
      {/* Left: Hamburger menu toggle */}
      <button
        className="header-menu-btn"
        onClick={onOpenSlideBar}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      {/* Center: Branding & Live Gateway indicator */}
      <div className="header-brand-group">
        <div className="header-title-row">
          <span className="header-app-name">CropIQ</span>
          <button
            className="gateway-pill-btn"
            onClick={onOpenSlideBar}
            title="Click to view Raspberry Pi Gateway diagnostics"
          >
            <span className="gateway-dot" />
            <span className="gateway-text">Pi Gateway</span>
          </button>
        </div>
      </div>

      {/* Right: Language & Theme controls */}
      <div className="header-controls">
        <div className="lang-selector">
          <Globe size={16} />
          <select
            value={i18n.language}
            onChange={handleLangChange}
            aria-label={t("language")}
          >
            <option value="en">EN</option>
            <option value="as">AS</option>
            <option value="hi">HI</option>
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={theme === "light" ? t("dark_mode") : t("light_mode")}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>
      </div>
    </header>
  );
}
