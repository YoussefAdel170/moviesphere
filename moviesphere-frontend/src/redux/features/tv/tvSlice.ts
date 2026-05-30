import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchPopularTv, searchTv, fetchTvWithFilters } from "./tvThunks";

export type TvFilterState = {
  genres: number[];
  yearRange: [number, number];
  voteAverage: number;
  sortBy: string;
  language?: string;
};

type TvState = {
  shows: any[];
  loading: boolean;
  error: string | null;
  pages: number;
  currentPage: number;
  filters: TvFilterState;
  searchQuery: string;
  debouncedQuery: string;
};

const resetFilterState: TvFilterState = {
  genres: [],
  yearRange: [1900, new Date().getFullYear()],
  voteAverage: 0,
  sortBy: "popularity.desc",
  language: localStorage.getItem("language") || "en-US",
};

const initialState: TvState = {
  shows: [],
  loading: false,
  error: null,
  pages: 0,
  currentPage: 1,
  filters: JSON.parse(
    localStorage.getItem("tvFilters") ||
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

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    setTvPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTvGenresFilter: (state, action: PayloadAction<number[]>) => {
      state.filters.genres = action.payload;
      localStorage.setItem("tvFilters", JSON.stringify(state.filters));
    },
    setTvYearRangeFilter: (state, action: PayloadAction<[number, number]>) => {
      state.filters.yearRange = action.payload;
      localStorage.setItem("tvFilters", JSON.stringify(state.filters));
    },
    setTvVoteAverageFilter: (state, action: PayloadAction<number>) => {
      state.filters.voteAverage = action.payload;
      localStorage.setItem("tvFilters", JSON.stringify(state.filters));
    },
    setTvSortByFilter: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload;
      localStorage.setItem("tvFilters", JSON.stringify(state.filters));
    },
    resetTvFilters: (state) => {
      state.filters = resetFilterState;
      localStorage.setItem("tvFilters", JSON.stringify(state.filters));
    },
    clearTvError: (state) => {
      state.error = null;
    },
    setTvSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setTvDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
    clearTvSearch: (state) => {
      state.searchQuery = "";
      state.debouncedQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularTv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularTv.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(fetchPopularTv.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch TV shows";
      })
      .addCase(searchTv.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPage = 1;
      })
      .addCase(searchTv.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(searchTv.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Search failed";
      })
      .addCase(fetchTvWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.results || [];
        state.pages = action.payload.total_pages || 0;
      })
      .addCase(fetchTvWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch filtered TV shows";
      });
  },
});

export const {
  setTvPage,
  setTvGenresFilter,
  setTvYearRangeFilter,
  setTvVoteAverageFilter,
  setTvSortByFilter,
  resetTvFilters,
  clearTvError,
  setTvSearchQuery,
  setTvDebouncedQuery,
  clearTvSearch,
} = tvSlice.actions;

export const hasActiveTvFilters = (filters: TvFilterState): boolean => {
  return (
    filters.genres.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < new Date().getFullYear() ||
    filters.voteAverage > 0 ||
    filters.sortBy !== "popularity.desc"
  );
};

export default tvSlice.reducer;
