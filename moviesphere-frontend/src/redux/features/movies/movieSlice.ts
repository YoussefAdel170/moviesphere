// src/redux/features/movies/movieSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPopularMovies,
  searchMovies,
  fetchMoviesWithFilters,
} from "./moviesThunks";

export type FilterState = {
  genres: number[];
  yearRange: [number, number];
  voteAverage: number;
  sortBy: string;
  language?: string;
};

type MoviesState = {
  movies: any[];
  loading: boolean;
  error: string | null;
  pages: number;
  currentPage: number;
  darkMode: boolean;
  language: string;
  direction: "ltr" | "rtl";
  filters: FilterState;
  searchQuery: string;
  debouncedQuery: string;
};

const resetFilterState: FilterState = {
  genres: [],
  yearRange: [1900, new Date().getFullYear()],
  voteAverage: 0,
  sortBy: "popularity.desc",
  language: localStorage.getItem("language") || "en-US",
};

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  pages: 0,
  currentPage: 1,
  direction: localStorage.getItem("language") === "ar" ? "rtl" : "ltr",
  darkMode: localStorage.getItem("darkMode") === "true",
  language: localStorage.getItem("language") || "en-US",
  filters: JSON.parse(
    localStorage.getItem("filters") ||
      JSON.stringify({
        genres: [],
        yearRange: [1900, new Date().getFullYear()],
        voteAverage: 0,
        sortBy: "popularity.desc",
        language: localStorage.getItem("language") || "en-US",
      }),
  ),
  searchQuery: "",
  debouncedQuery: "",
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    // Set Current Page
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Dark Mode
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },

    // Language
    setLanguage: (state, action: PayloadAction<"en-US" | "ar">) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
      state.direction = action.payload === "ar" ? "rtl" : "ltr";
      state.filters.language = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    // Filter By Genre
    setGenresFilter: (state, action: PayloadAction<number[]>) => {
      state.filters.genres = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },

    // Filter by Year
    setYearRangeFilter: (state, action: PayloadAction<[number, number]>) => {
      state.filters.yearRange = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    // Filter By voting
    setVoteAverageFilter: (state, action: PayloadAction<number>) => {
      state.filters.voteAverage = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },

    // Sort By
    setSortByFilter: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },

    // Reset Filters
    resetFilters: (state) => {
      state.filters = resetFilterState;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },

    // Set Search Query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Set Debounced Query
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },

    // Clear Search
    clearSearch: (state) => {
      state.searchQuery = "";
      state.debouncedQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular
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
      // Search
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
      })
      // Discover (filters)
      .addCase(fetchMoviesWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(fetchMoviesWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch filtered movies";
      });
  },
});

export const {
  setPage,
  toggleDarkMode,
  setLanguage,
  clearError,
  setGenresFilter,
  setYearRangeFilter,
  setVoteAverageFilter,
  setSortByFilter,
  resetFilters,
  setSearchQuery,
  setDebouncedQuery,
  clearSearch,
} = moviesSlice.actions;

export const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.genres.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < new Date().getFullYear() ||
    filters.voteAverage > 0 ||
    filters.sortBy !== "popularity.desc"
  );
};

export default moviesSlice.reducer;
