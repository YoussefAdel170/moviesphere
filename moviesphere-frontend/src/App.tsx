// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/navbar/NavBar";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import SimilarMoviesPage from "./pages/SimilarMoviesPage";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { syncLanguage } from "./i18n/languageSync";

function App() {
  const { direction, language } = useAppSelector((state) => state.movies);

  // Sync i18n when language changes
  useEffect(() => {
    syncLanguage(language as "en-US" | "ar");
  }, [language]);

  // Set HTML direction and lang attributes
  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute(
      "lang",
      language === "ar" ? "ar" : "en",
    );
  }, [direction, language]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/movie/:id/similar" element={<SimilarMoviesPage />} />
        <Route
          path="/movie/:id/ai-recommend"
          element={<AIRecommendationsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
