// Navbar.tsx
import { useTranslation } from "react-i18next";
import "./NavBar.scss";
import Logo from "./subComponents/logo/Logo";
import MobileBurgerMenuButton from "./subComponents/mobile/menuButton";
import MobileDrawer from "./subComponents/mobile/drawer";
import FullSearch from "./subComponents/search/FullSearchComponent";
import { useNavbarUI } from "../../../hooks/NavBar/useNavbarUI";
import { useScrolled } from "../../../hooks/NavBar/useScrolled";
import { useVoiceSearch } from "../../../hooks/NavBar/useVoiceSearch";
import { useNavbar } from "../../../hooks/useNavbar";
import { useSearch } from "../../../hooks/NavBar/useSeach";
import Actions from "./subComponents/actions/Actions";

export default function Navbar() {
  const {
    darkMode,
    language,
    handleToggleDarkMode,
    handleToggleLanguage,
    loading,
  } = useNavbar();

  const { open, toggleDrawer } = useNavbarUI();
  const { scrolled } = useScrolled();

  // SINGLE instance of useSearch
  const {
    query,
    searchInputRef,
    handleSearchChange,
    onChangeQuery,
    clearSearchAndGoHome, // get the clear function
  } = useSearch();

  const { listening, voiceError, handleVoice } = useVoiceSearch(
    language,
    onChangeQuery,
  );

  const { t } = useTranslation("navbar");

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Logo - now receives onClearSearch prop */}
        <Logo logo_aria={t("logo_aria")} onClearSearch={clearSearchAndGoHome} />

        {/* Desktop Search */}
        <FullSearch
          searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
          query={query}
          handleSearchChange={handleSearchChange}
          handleVoice={handleVoice}
          listening={listening}
          voiceError={voiceError}
          loading={loading}
          search_placeholder={t("search_placeholder")}
          search_text_aria={t("search_aria")}
          voice_text_aria={t("voice_search_aria")}
        />

        {/* Desktop Actions */}
        <Actions
          variant="desktop"
          darkMode={darkMode}
          language={language}
          handleToggleDarkMode={handleToggleDarkMode}
          handleToggleLanguage={handleToggleLanguage}
          darkmode_aria={t("darkmode_aria")}
          language_aria={t("language_aria")}
          dark_mode_text={t("dark_mode")}
          language_text={t("language_label")}
        />

        {/* Mobile Menu Button */}
        <MobileBurgerMenuButton
          toggleDrawer={toggleDrawer}
          open={open}
          menu_button_aria={t("menu_button_aria")}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={open}
        query={query}
        listening={listening}
        voiceError={voiceError}
        handleSearchChange={handleSearchChange}
        handleVoice={handleVoice}
        darkMode={darkMode}
        language={language}
        handleToggleDarkMode={handleToggleDarkMode}
        handleToggleLanguage={handleToggleLanguage}
        toggleDrawer={toggleDrawer}
        search_placeholder={t("search_placeholder")}
        search_aria={t("search_aria")}
        darkmode_aria={t("darkmode_aria")}
        language_aria={t("language_aria")}
        dark_mode_text={t("dark_mode")}
        language_text={t("language_label")}
        voice_text_aria={t("voice_search_aria")}
      />
      {open && <div className="navbar__overlay" onClick={toggleDrawer} />}
    </nav>
  );
}
