import { FiGlobe, FiMoon, FiSun } from "react-icons/fi";
import TooltipComponent from "../../../helper/tooltip/TooltipComponent";

type Variant = "desktop" | "mobile";

type Props = {
  variant: Variant;

  darkMode: boolean;
  language: string;

  handleToggleDarkMode: () => void;
  handleToggleLanguage: () => void;
  toggleDrawer?: () => void;

  darkmode_aria: string;
  language_aria: string;

  dark_mode_text: string;
  language_text: string;
};

export default function Actions({
  variant,
  darkMode,
  language,
  handleToggleDarkMode,
  handleToggleLanguage,
  toggleDrawer,
  darkmode_aria,
  language_aria,
  dark_mode_text,
  language_text,
}: Props) {
  const isMobile = variant === "mobile";

  // 🧠 ONE SOURCE OF TRUTH FOR ACTIONS
  const onDarkMode = () => {
    handleToggleDarkMode();
    if (isMobile) toggleDrawer?.();
  };

  const onLanguage = () => {
    handleToggleLanguage();
    if (isMobile) toggleDrawer?.();
  };

  // ======================
  // DESKTOP UI
  // ======================
  if (!isMobile) {
    return (
      <div className="navbar__actions">
        <TooltipComponent title={darkmode_aria}>
          <button onClick={onDarkMode} aria-label={darkmode_aria}>
            {darkMode ? <FiMoon /> : <FiSun />}
          </button>
        </TooltipComponent>

        <TooltipComponent title={language_aria}>
          <button onClick={onLanguage} aria-label={language_aria}>
            <FiGlobe />
            {language.toUpperCase()}
          </button>
        </TooltipComponent>
      </div>
    );
  }

  // ======================
  // MOBILE UI
  // ======================
  return (
    <div className="drawer-actions">
      <TooltipComponent title={darkmode_aria}>
        <button onClick={onDarkMode} className="drawer-btn">
          <span className="drawer-icon">
            {darkMode ? <FiMoon /> : <FiSun />}
          </span>
          <span>{dark_mode_text}</span>
        </button>
      </TooltipComponent>

      <TooltipComponent title={language_aria}>
        <button onClick={onLanguage} className="drawer-btn">
          <span className="drawer-icon">
            <FiGlobe />
          </span>
          <span>{language_text}</span>
        </button>
      </TooltipComponent>
    </div>
  );
}
