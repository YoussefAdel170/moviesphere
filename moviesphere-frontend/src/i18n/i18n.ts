import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English namespaces
import enCommon from "./locales/en-US/common.json";
import enNavbar from "./locales/en-US/navbar.json";
import enMovieCard from "./locales/en-US/movieCard.json";
import enMovieDetails from "./locales/en-US/movieDetails.json";
import enAiRecommendations from "./locales/en-US/aiRecommendations.json";
import enPagination from "./locales/en-US/pagination.json";
import enEmptyState from "./locales/en-US/emptyState.json";
import enErrorPage from "./locales/en-US/errorPage.json";
import enSimilarMoviesPage from "./locales/en-US/similarMoviesPage.json";
import enGenres from "./locales/en-US/genre.json";
import enFilter from "./locales/en-US/filter.json";

// Arabic namespaces
import arCommon from "./locales/ar/common.json";
import arNavbar from "./locales/ar/navbar.json";
import arMovieCard from "./locales/ar/movieCard.json";
import arMovieDetails from "./locales/ar/movieDetails.json";
import arAiRecommendations from "./locales/ar/aiRecommendations.json";
import arPagination from "./locales/ar/pagination.json";
import arEmptyState from "./locales/ar/emptyState.json";
import arErrorPage from "./locales/ar/errorPage.json";
import arSimilarMoviesPage from "./locales/ar/similarMoviesPage.json";
import arGenres from "./locales/ar/genre.json";
import arFilter from "./locales/ar/filter.json";

import { DEFAULT_DIRECTION, DEFAULT_LANGUAGE } from "../constants/general";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "en-US": {
        common: enCommon,
        navbar: enNavbar,
        movieCard: enMovieCard,
        movieDetails: enMovieDetails,
        aiRecommendations: enAiRecommendations,
        pagination: enPagination,
        emptyState: enEmptyState,
        errorPage: enErrorPage,
        similarMoviesPage: enSimilarMoviesPage,
        genre: enGenres,
        filter: enFilter,
      },
      ar: {
        common: arCommon,
        navbar: arNavbar,
        movieCard: arMovieCard,
        movieDetails: arMovieDetails,
        aiRecommendations: arAiRecommendations,
        pagination: arPagination,
        emptyState: arEmptyState,
        errorPage: arErrorPage,
        similarMoviesPage: arSimilarMoviesPage,
        genre: arGenres,
        filter: arFilter,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    ns: [
      "common",
      "navbar",
      "movieCard",
      "movieDetails",
      "aiRecommendations",
      "pagination",
      "emptyState",
      "errorPage",
      "similarMoviesPage",
      "genre",
      "filter",
    ],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      caches: [], // disable caching to avoid conflicts with your Redux language
    },
  });

// Set initial direction (you'll update this dynamically later)
document.documentElement.dir = DEFAULT_DIRECTION;

export default i18n;
