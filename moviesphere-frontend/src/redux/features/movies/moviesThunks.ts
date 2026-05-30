import { createAsyncThunk } from "@reduxjs/toolkit";
import { moviesApi } from "../../../services/moviesApi";
import type { FilterState } from "./movieSlice";
import { TMDB_MIN_YEAR } from "../../../constants/general";
import { tmdbApi } from "../../../services/tmdbApi";

export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async ({ page, language }: { page: number; language: string }) => {
    const data = await moviesApi.getPopular(page, language);
    return data;
  },
);

export const searchMovies = createAsyncThunk(
  "movies/search",
  async ({ query, language }: { query: string; language: string }) => {
    if (!query.trim()) return { results: [] };
    const data = await moviesApi.search(query, language);
    return data;
  },
);

export const fetchMoviesWithFilters = createAsyncThunk(
  "movies/fetchMoviesWithFilters",
  async ({
    page,
    language,
    filters,
  }: {
    page: number;
    language: string;
    filters: FilterState;
  }) => {
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
  },
);

export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrending",
  async ({
    timeWindow,
    language,
    page = 1,
  }: {
    timeWindow: string;
    language: string;
    page?: number;
  }) => {
    const data = await tmdbApi.trending(
      "movie",
      timeWindow as "day" | "week",
      page,
      language,
    );
    return data;
  },
);

export const fetchTrendingAll = createAsyncThunk(
  "movies/fetchTrendingAll",
  async ({
    timeWindow = "day",
    language,
  }: {
    timeWindow?: string;
    language: string;
  }) => {
    const data = await tmdbApi.trending(
      "all",
      timeWindow as "day" | "week",
      1,
      language,
    );
    return data;
  },
);

export const fetchUpcomingMovies = createAsyncThunk(
  "movies/fetchUpcoming",
  async ({ page, language }: { page: number; language: string }) => {
    const data = await tmdbApi.upcoming(page, language);
    return data;
  },
);
