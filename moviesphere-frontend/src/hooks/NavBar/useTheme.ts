import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setLanguage,
  toggleDarkMode,
} from "../../redux/features/movies/movieSlice";

export function useTheme() {
  const dispatch = useAppDispatch();
  const { darkMode, language } = useAppSelector((s) => s.movies);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleToggleDarkMode = () => dispatch(toggleDarkMode());
  const handleToggleLanguage = () =>
    dispatch(setLanguage(language === "ar" ? "en-US" : "ar"));

  return { darkMode, language, handleToggleDarkMode, handleToggleLanguage };
}
