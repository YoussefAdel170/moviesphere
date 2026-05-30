import { tmdbApi } from "./tmdbApi";

export const tvApi = {
  popular: (page?: number, language?: string) =>
    tmdbApi.popular("tv", page, language),
  search: (query: string, page = 1, language?: string) =>
    tmdbApi.search("tv", query, page, language),
  details: (id: number, language?: string) =>
    tmdbApi.details("tv", id, language),
  credits: (id: number, language?: string) =>
    tmdbApi.credits("tv", id, language),
  similar: (id: number, page?: number, language?: string) =>
    tmdbApi.similar("tv", id, page, language),
  videos: (id: number, language?: string) => tmdbApi.videos("tv", id, language),
  watchProviders: (id: number) => tmdbApi.watchProviders("tv", id),
  reviews: (id: number, page = 1) => tmdbApi.reviews("tv", id, page),
  seasonDetails: (tvId: number, seasonNumber: number, language?: string) =>
    tmdbApi.seasonDetails(tvId, seasonNumber, language),
  discover: (queryString: string) => tmdbApi.discoverTv(queryString),
};
