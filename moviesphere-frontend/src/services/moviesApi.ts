import { tmdbApi } from "./tmdbApi";

export const moviesApi = {
  getPopular: (page?: number, language?: string) =>
    tmdbApi.popular("movie", page, language),
  search: (query: string, language?: string) =>
    tmdbApi.search("movie", query, 1, language),
  details: (id: number, language?: string) =>
    tmdbApi.details("movie", id, language),
  credits: (id: number, language?: string) =>
    tmdbApi.credits("movie", id, language),
  getSimilar: (id: number, page?: number, language?: string) =>
    tmdbApi.similar("movie", id, page, language),
  videos: (id: number, language?: string) =>
    tmdbApi.videos("movie", id, language),
  watchProviders: (id: number) => tmdbApi.watchProviders("movie", id),
  releaseDates: (id: number) => tmdbApi.releaseDates(id),
  reviews: (id: number, page: number = 1) => tmdbApi.reviews("movie", id, page),
  genres: (language?: string) => tmdbApi.genres("movie", language),
  discover: (queryString: string) => tmdbApi.discover(queryString),
};
