import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchPopularMovies, searchMovies } from "./moviesThunks";
import i18n from "../../../i18n/i18n";

type MoviesState = {
  movies: any[];
  loading: boolean;
  error: string | null;
  pages: number;
  currentPage: number;
  darkMode: boolean;
  language: string;
};

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  pages: 0,
  currentPage: 1,
  darkMode: localStorage.getItem("darkMode") === "true",
  language: localStorage.getItem("language") || "en-US",
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
    },

    toggleLanguage: (state) => {
      const newLang = state.language === "ar" ? "en-US" : "ar";

      state.language = newLang;
      localStorage.setItem("language", newLang);

      const i18nLang = newLang === "ar" ? "ar" : "en-US";
      i18n.changeLanguage(i18nLang);
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= POPULAR =================
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch movies";
      })

      // ================= SEARCH =================
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPage = 1;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Search failed";
      });
  },
});

export const {
  setPage,
  toggleDarkMode,
  toggleLanguage,
  clearError,
} = moviesSlice.actions;

export default moviesSlice.reducer;