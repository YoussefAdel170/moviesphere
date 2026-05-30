import { createAsyncThunk } from "@reduxjs/toolkit";
import { tvApi } from "../../../services/tvApi";
import type { TvFilterState } from "./tvSlice";
import { TMDB_MIN_YEAR } from "../../../constants/general";

export const fetchPopularTv = createAsyncThunk(
  "tv/fetchPopular",
  async ({ page, language }: { page: number; language: string }) => {
    const data = await tvApi.popular(page, language);
    return data;
  },
);

export const searchTv = createAsyncThunk(
  "tv/search",
  async ({ query, language }: { query: string; language: string }) => {
    if (!query.trim()) return { results: [] };
    const data = await tvApi.search(query, 1, language);
    return data;
  },
);

export const fetchTvWithFilters = createAsyncThunk(
  "tv/fetchTvWithFilters",
  async ({
    page,
    language,
    filters,
  }: {
    page: number;
    language: string;
    filters: TvFilterState;
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
      params.append("first_air_date.gte", `${filters.yearRange[0]}-01-01`);
    if (filters.yearRange[1] < new Date().getFullYear())
      params.append("first_air_date.lte", `${filters.yearRange[1]}-12-31`);
    const data = await tvApi.discover(params.toString());
    return data;
  },
);
