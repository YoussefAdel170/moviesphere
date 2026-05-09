import { useAppSelector } from "../redux/hooks";
import { useTheme } from "./NavBar/useTheme";

export function useNavbar() {
  const { darkMode, language, handleToggleDarkMode, handleToggleLanguage } =
    useTheme();

  const { loading } = useAppSelector((s) => s.movies);

  return {
    darkMode,
    language,
    handleToggleDarkMode,
    handleToggleLanguage,
    loading,
  };
}
