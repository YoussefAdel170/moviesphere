// src/services/moviesApi.ts
import { DEFAULT_LANGUAGE, DEFAULT_PAGE_NUMBER } from "../constants/general";
import { apiClient } from "./apiClient";

export const moviesApi = {
  getPopular: (page = DEFAULT_PAGE_NUMBER, language = DEFAULT_LANGUAGE) =>
    apiClient(`/movie/popular?language=${language}&page=${page}`),

  search: (query: string, language = DEFAULT_LANGUAGE) =>
    apiClient(`/search/movie?query=${query}&language=${language}`),

  details: (id: number, language = DEFAULT_LANGUAGE) =>
    apiClient(`/movie/${id}?language=${language}`),

  credits: (id: number, language = DEFAULT_LANGUAGE) =>
    apiClient(`/movie/${id}/credits?language=${language}`),

  getSimilar: (
    id: number,
    page = DEFAULT_PAGE_NUMBER,
    language = DEFAULT_LANGUAGE,
  ) => apiClient(`/movie/${id}/similar?language=${language}&page=${page}`),

  // New methods for filters
  genres: (language = DEFAULT_LANGUAGE) =>
    apiClient(`/genre/movie/list?language=${language}`),

  discover: (queryString: string) =>
    apiClient(`/discover/movie?${queryString}`),
};
