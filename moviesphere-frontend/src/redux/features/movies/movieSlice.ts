import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPopularMovies,
  searchMovies,
  fetchMoviesWithFilters,
  fetchTrendingAll,
  fetchUpcomingMovies,
  fetchTrendingMovies,
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
  trendingAll: any[];
  upcomingMovies: any[];
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
  trendingAll: [],
  upcomingMovies: [],
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
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
    setLanguage: (state, action: PayloadAction<"en-US" | "ar">) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
      state.direction = action.payload === "ar" ? "rtl" : "ltr";
      state.filters.language = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    clearError: (state) => {
      state.error = null;
    },
    setGenresFilter: (state, action: PayloadAction<number[]>) => {
      state.filters.genres = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    setYearRangeFilter: (state, action: PayloadAction<[number, number]>) => {
      state.filters.yearRange = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    setVoteAverageFilter: (state, action: PayloadAction<number>) => {
      state.filters.voteAverage = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    setSortByFilter: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    resetFilters: (state) => {
      state.filters = resetFilterState;
      localStorage.setItem("filters", JSON.stringify(state.filters));
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.debouncedQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchTrendingAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingAll.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingAll = action.payload.results?.slice(0, 10) || [];
      })
      .addCase(fetchTrendingAll.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch trending content";
      })
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingMovies = action.payload.results?.slice(0, 10) || [];
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch upcoming movies";
      })
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch trending movies";
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
