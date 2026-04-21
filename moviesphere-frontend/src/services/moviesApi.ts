// src/services/moviesApi.ts
import { apiClient } from "./apiClient";

const DEFAULT_LANG = "en-US";

export const moviesApi = {
  getPopular: (page = 1, language = DEFAULT_LANG) =>
    apiClient(`/movie/popular?language=${language}&page=${page}`),

  search: (query: string, language = DEFAULT_LANG) =>
    apiClient(`/search/movie?query=${encodeURIComponent(query)}&language=${language}`),

  details: (id: number, language = DEFAULT_LANG) =>
    apiClient(`/movie/${id}?language=${language}`),

  getSimilar: (id: number, page = 1, language = DEFAULT_LANG) =>
    apiClient(`/movie/${id}/similar?language=${language}&page=${page}`),
};