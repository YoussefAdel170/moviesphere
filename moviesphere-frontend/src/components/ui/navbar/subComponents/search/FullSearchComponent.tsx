import { FiSearch } from "react-icons/fi";
import VoiceButton from "./VoiceButton";
import SearchInput from "./SearchInput";

type Props = {
  searchInputRef: React.RefObject<HTMLInputElement>;
  query: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoice: () => void;
  listening: boolean;
  voiceError: string | null;
  loading: boolean;
  search_placeholder: string;
  search_text_aria: string;
  voice_text_aria: string;
};

export default function FullSearch(props: Props) {
  const {
    searchInputRef,
    query,
    handleSearchChange,
    handleVoice,
    listening,
    voiceError,
    loading,
    search_placeholder,
    search_text_aria,
    voice_text_aria,
  } = props;

  const onVoiceClick = () => handleVoice();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e);

  return (
    <div className="navbar__search">
      <div className="search-wrapper">
        {/* Search Icon */}
        <FiSearch className="search-icon" />

        {/* Search Input */}
        <SearchInput
          value={query}
          onChange={onChange}
          placeholder={search_placeholder}
          ariaLabel={search_text_aria}
          inputRef={searchInputRef}
        />

        {/* Voice Button */}
        <VoiceButton
          onClick={onVoiceClick}
          listening={listening}
          ariaLabel={voice_text_aria}
        />
      </div>

      {/* UI STATES (UNCHANGED) */}
      {voiceError && <div className="voice-error">{voiceError}</div>}

      {loading && <div className="loading-indicator">{loading}</div>}
    </div>
  );
}
