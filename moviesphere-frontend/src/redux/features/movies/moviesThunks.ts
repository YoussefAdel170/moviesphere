// src/redux/features/movies/moviesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { moviesApi } from "../../../services/moviesApi";
import type { FilterState } from "./movieSlice";
import { TMDB_MIN_YEAR } from "../../../constants/general";

// ============= Fetch Popular Movies =============
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async ({ page, language }: { page: number; language: string }, thunkAPI) => {
    try {
      const data = await moviesApi.getPopular(page, language);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ============= Search Movies =============
export const searchMovies = createAsyncThunk(
  "movies/search",
  async (
    { query, language }: { query: string; language: string },
    thunkAPI,
  ) => {
    try {
      if (!query.trim()) return { results: [] };
      const data = await moviesApi.search(query, language);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ============= Fetch Movies with Filters =============
export const fetchMoviesWithFilters = createAsyncThunk(
  "movies/fetchMoviesWithFilters",
  async (
    {
      page,
      language,
      filters,
    }: { page: number; language: string; filters: FilterState },
    thunkAPI,
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("language", language);
      params.append("sort_by", filters.sortBy);
      if (filters.genres.length)
        params.append("with_genres", filters.genres.join(","));
      if (filters.voteAverage > 0)
        params.append("vote_average.gte", String(filters.voteAverage));
      if (filters.yearRange[0] > TMDB_MIN_YEAR)
        params.append(
          "primary_release_date.gte",
          `${filters.yearRange[0]}-01-01`,
        );
      if (filters.yearRange[1] < new Date().getFullYear())
        params.append(
          "primary_release_date.lte",
          `${filters.yearRange[1]}-12-31`,
        );
      const data = await moviesApi.discover(params.toString());
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);
