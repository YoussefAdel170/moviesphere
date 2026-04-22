import {
  FiMenu,
  FiX,
  FiSearch,
  FiMic,
  FiMoon,
  FiSun,
  FiGlobe
} from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { useNavbar } from "../../../hooks/useNavbar";
import "./NavBar.scss";
import Logo from "../logo/Logo";

// 👇 add this

export default function Navbar() {
  const { t } = useTranslation("navbar");

  const {
    darkMode,
    language,
    loading,
    query,
    open,
    listening,
    voiceError,
    scrolled,
    searchInputRef,
    handleSearchChange,
    handleVoice,
    handleToggleDarkMode,
    handleToggleLanguage,
    handleLogoClick,
    toggleDrawer,
  } = useNavbar();

  const placeholder = t("search_placeholder");
  const loadingText = t("loading");

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar__container">

        {/* ✅ LOGO (theme-aware) */}
        <Logo onClick={handleLogoClick} />

        {/* Desktop Search */}
        <div className="navbar__search">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder={placeholder}
              aria-label={t("search_aria")}
            />

            <button
              onClick={handleVoice}
              aria-label={t("voice_aria")}
              className={`voice-btn ${listening ? "listening" : ""}`}
            >
              <FiMic />
            </button>
          </div>

          {voiceError && <div className="voice-error">{voiceError}</div>}
          {loading && <div className="loading-indicator">{loadingText}</div>}
        </div>

        {/* Desktop Actions */}
        <div className="navbar__actions">

          {/* ✅ Theme toggle (your existing system) */}
          <button onClick={handleToggleDarkMode} aria-label={t("darkmode_aria")}>
            {darkMode ? <FiMoon /> : <FiSun />}
          </button>

          <button onClick={handleToggleLanguage} aria-label={t("language_aria")} className="d-flex gap-1">
            <FiGlobe /> {language === "ar" ? "AR" : "EN"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar__mobile"
          onClick={toggleDrawer}
          aria-expanded={open}
          aria-label={t("menu_aria")}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar__drawer ${open ? "open" : ""}`}>
        <div className="drawer-content">

          <div className="drawer-search">
            <FiSearch />
            <input
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder={placeholder}
              autoFocus={open}
              aria-label={t("search_aria")}
            />
            <button
              onClick={handleVoice}
              className={`voice-btn ${listening ? "listening" : ""}`}
            >
              <FiMic />
            </button>
          </div>

          <div className="drawer-actions">

            <button
              onClick={() => {
                handleToggleDarkMode();
                toggleDrawer();
              }}
              className="drawer-btn"
            >
              <span className="drawer-icon">
                {darkMode ? <FiMoon /> : <FiSun />}
              </span>
              <span>{t("dark_mode")}</span>
            </button>

            <button
              onClick={() => {
                handleToggleLanguage();
                toggleDrawer();
              }}
              className="drawer-btn"
            >
              <span className="drawer-icon">
                <FiGlobe />
              </span>
              <span>
                {t("language_label")} ({language === "ar" ? "EN" : "AR"})
              </span>
            </button>
          </div>

          {voiceError && (
            <p className="voice-error-mobile">{voiceError}</p>
          )}
        </div>
      </div>

      {open && (
        <div className="navbar__overlay" onClick={toggleDrawer} />
      )}
    </nav>
  );
}