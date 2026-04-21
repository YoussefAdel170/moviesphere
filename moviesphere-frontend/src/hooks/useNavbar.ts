import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useDebounce } from './useDebounce';
import {
  toggleDarkMode,
  toggleLanguage,
  clearError
} from '../redux/features/movies/movieSlice';

export function useNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { darkMode, language, loading, error } = useAppSelector(
    (state) => state.movies
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);

  // ✅ ALWAYS STRING SAFE
  const [query, setQuery] = useState<string>(
    searchParams.get('query') || ''
  );

  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const recognitionRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    debouncedValue: debouncedQuery,
    cancel: cancelDebounce,
  } = useDebounce(query, 400);

  const skipNextDebounceRef = useRef(false);

  /* =========================
     DARK MODE
  ========================= */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  /* =========================
     SCROLL
  ========================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* =========================
     SAFE DEBOUNCED QUERY SYNC
  ========================= */
  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const safeQuery = debouncedQuery ?? '';

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const oldQuery = prev.get('query') || '';

      if (safeQuery.trim()) {
        newParams.set('query', safeQuery);

        if (oldQuery !== safeQuery) {
          newParams.set('page', '1');
        }
      } else {
        newParams.delete('query');
        if (oldQuery) newParams.set('page', '1');
      }

      return newParams;
    });
  }, [debouncedQuery, setSearchParams]);

  /* =========================
     SYNC INPUT WITH URL
  ========================= */
  useEffect(() => {
    const urlQuery = searchParams.get('query') || '';
    if (urlQuery !== query) setQuery(urlQuery);
  }, [searchParams]);

  /* =========================
     VOICE SETUP
  ========================= */
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice search not supported');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'ar' ? 'ar-EG' : 'en-US';

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setQuery(spokenText ?? '');
    };

    recognition.onerror = (event: any) => {
      setVoiceError(`Error: ${event.error}`);
      setListening(false);
      setTimeout(() => setVoiceError(null), 3000);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {}
    };
  }, [language]);

  /* =========================
     ESC CLOSE
  ========================= */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? '';
    setQuery(value);

    if (error) dispatch(clearError());
  };

  const clearSearch = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  const handleVoice = async () => {
    if (!recognitionRef.current) return;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      recognitionRef.current.start();
    } catch {
      setVoiceError('Microphone permission denied');
      setTimeout(() => setVoiceError(null), 3000);
    }
  };

  const handleToggleDarkMode = () => dispatch(toggleDarkMode());
  const handleToggleLanguage = () => dispatch(toggleLanguage());

  const handleLogoClick = () => {
    cancelDebounce();
    skipNextDebounceRef.current = true;

    setQuery('');
    setSearchParams({ page: '1' }, { replace: true });
    navigate('/', { replace: true });
  };

  const toggleDrawer = () => setOpen((p) => !p);

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