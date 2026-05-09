import { FiSearch, FiMic } from "react-icons/fi";
import TooltipComponent from "../../../helper/tooltip/TooltipComponent";
import Actions from "../actions/Actions";

type Props = {
  open: boolean;
  query: string;
  listening: boolean;
  voiceError: string | null;

  search_placeholder: string;
  search_aria: string;
  voice_text_aria: string;

  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoice: () => void;

  darkMode: boolean;
  language: string;

  handleToggleDarkMode: () => void;
  handleToggleLanguage: () => void;

  toggleDrawer: () => void;

  darkmode_aria: string;
  language_aria: string;

  dark_mode_text: string;
  language_text: string;
};

export default function MobileDrawer({
  open,
  query,
  listening,
  voiceError,

  search_placeholder,
  search_aria,
  voice_text_aria,

  handleSearchChange,
  handleVoice,

  darkMode,
  language,
  handleToggleDarkMode,
  handleToggleLanguage,
  toggleDrawer,

  darkmode_aria,
  language_aria,

  dark_mode_text,
}: Props) {
  return (
    <div className={`navbar__drawer ${open ? "open" : ""}`}>
      <div className="drawer-content">
        {/* SEARCH */}
        <div className="drawer-search">
          <FiSearch />

          <TooltipComponent
            title={search_aria}
            customClass="flex-1"
            position="bottom"
          >
            <input
              type="search"
              value={query}
              className="flex-1"
              onChange={handleSearchChange}
              placeholder={search_placeholder}
              aria-label={search_aria}
              autoFocus={open}
            />
          </TooltipComponent>

          <TooltipComponent title={voice_text_aria} position="bottom">
            <button
              onClick={handleVoice}
              className={`voice-btn ${listening ? "listening" : ""}`}
            >
              <FiMic />
            </button>
          </TooltipComponent>
        </div>

        {/* ACTIONS (mobile variant reuse) */}
        <Actions
          variant="mobile"
          darkMode={darkMode}
          language={language}
          handleToggleDarkMode={handleToggleDarkMode}
          handleToggleLanguage={handleToggleLanguage}
          toggleDrawer={toggleDrawer}
          darkmode_aria={darkmode_aria}
          language_aria={language_aria}
          dark_mode_text={dark_mode_text}
          language_text={language === "ar" ? "English" : "العربية"}
        />

        {voiceError && <p className="voice-error-mobile">{voiceError}</p>}
      </div>
    </div>
  );
}
