import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useDebounce } from "./useDebounce";
import {
  toggleDarkMode,
  setLanguage,
  clearError,
} from "../redux/features/movies/movieSlice";

export function useNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { darkMode, language, loading, error } = useAppSelector(
    (state) => state.movies,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const recognitionRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { debouncedValue: debouncedQuery, cancel: cancelDebounce } =
    useDebounce(query, 400);
  const skipNextDebounceRef = useRef(false);

  // Dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }
    const safeQuery = debouncedQuery ?? "";
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const oldQuery = prev.get("query") || "";
      if (safeQuery.trim()) {
        newParams.set("query", safeQuery);
        if (oldQuery !== safeQuery) newParams.set("page", "1");
      } else {
        newParams.delete("query");
        if (oldQuery) newParams.set("page", "1");
      }
      return newParams;
    });
  }, [debouncedQuery, setSearchParams]);

  // Sync input when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (urlQuery !== query) setQuery(urlQuery);
  }, [searchParams]);

  // Voice recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "ar" ? "ar-EG" : "en-US";
    recognition.onresult = (event: any) =>
      setQuery(event.results[0][0].transcript ?? "");
    recognition.onerror = (event: any) => {
      setVoiceError(`Error: ${event.error}`);
      setListening(false);
      setTimeout(() => setVoiceError(null), 3000);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current?.abort?.();
    };
  }, [language]);

  // ESC close drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (error) dispatch(clearError());
  };

  const clearSearch = () => {
    setQuery("");
    searchInputRef.current?.focus();
  };

  const handleVoice = async () => {
    if (!recognitionRef.current) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      recognitionRef.current.start();
    } catch {
      setVoiceError("Microphone permission denied");
      setTimeout(() => setVoiceError(null), 3000);
    }
  };

  const handleToggleDarkMode = () => dispatch(toggleDarkMode());
  const handleToggleLanguage = () =>
    dispatch(setLanguage(language === "ar" ? "en-US" : "ar"));

  // ✅ Logo click – clean reset without double fetch
  const handleLogoClick = () => {
    cancelDebounce();
    setQuery("");
    skipNextDebounceRef.current = true;
    // Clear URL parameters and go to home page
    setSearchParams({}, { replace: true });
    navigate("/", { replace: true });
  };

  const toggleDrawer = () => setOpen((prev) => !prev);

  return {
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
    clearSearch,
    handleVoice,
    handleToggleDarkMode,
    handleToggleLanguage,
    handleLogoClick,
    toggleDrawer,
  };
}
