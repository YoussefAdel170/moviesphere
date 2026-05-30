// src/services/tmdbApi.ts
import { apiClient } from "./apiClient";
import { DEFAULT_LANGUAGE, DEFAULT_PAGE_NUMBER } from "../constants/general";

type MediaType = "movie" | "tv";

class TmdbApi {
  private getEndpoint(mediaType: MediaType, path: string): string {
    return `/${mediaType}${path}`;
  }

  // Get popular (movies or TV)
  popular(
    mediaType: MediaType = "movie",
    page = DEFAULT_PAGE_NUMBER,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(`/${mediaType}/popular?language=${language}&page=${page}`);
  }

  // Search (movies or TV)
  search(
    mediaType: MediaType = "movie",
    query: string,
    page = 1,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      `/search/${mediaType}?query=${encodeURIComponent(query)}&language=${language}&page=${page}`,
    );
  }

  // Details
  details(
    mediaType: MediaType = "movie",
    id: number,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      this.getEndpoint(mediaType, `/${id}?language=${language}`),
    );
  }

  // Credits (cast & crew)
  credits(
    mediaType: MediaType = "movie",
    id: number,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      this.getEndpoint(mediaType, `/${id}/credits?language=${language}`),
    );
  }

  // Similar
  similar(
    mediaType: MediaType = "movie",
    id: number,
    page = DEFAULT_PAGE_NUMBER,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      this.getEndpoint(
        mediaType,
        `/${id}/similar?language=${language}&page=${page}`,
      ),
    );
  }

  // Videos (trailers)
  videos(
    mediaType: MediaType = "movie",
    id: number,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      this.getEndpoint(mediaType, `/${id}/videos?language=${language}`),
    );
  }

  // Watch providers
  watchProviders(mediaType: MediaType = "movie", id: number) {
    return apiClient(this.getEndpoint(mediaType, `/${id}/watch/providers`));
  }

  // Reviews (pagination)
  reviews(mediaType: MediaType = "movie", id: number, page = 1) {
    return apiClient(
      this.getEndpoint(mediaType, `/${id}/reviews?page=${page}`),
    );
  }

  // Release dates / certification (movies only)
  releaseDates(id: number) {
    return apiClient(`/movie/${id}/release_dates`);
  }

  // TV specific: season details
  seasonDetails(
    tvId: number,
    seasonNumber: number,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(`/tv/${tvId}/season/${seasonNumber}?language=${language}`);
  }

  // Genre lists
  genres(mediaType: MediaType = "movie", language = DEFAULT_LANGUAGE) {
    return apiClient(`/genre/${mediaType}/list?language=${language}`);
  }

  // Discover (movies only – can be extended)
  discover(queryString: string) {
    return apiClient(`/discover/movie?${queryString}`);
  }

  discoverTv(queryString: string) {
    return apiClient(`/discover/tv?${queryString}`);
  }

  //   Trending
  trending(
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "day",
    page = 1,
    language = DEFAULT_LANGUAGE,
  ) {
    return apiClient(
      `/trending/${mediaType}/${timeWindow}?language=${language}&page=${page}`,
    );
  }
  upcoming(page = 1, language = DEFAULT_LANGUAGE) {
    return apiClient(`/movie/upcoming?language=${language}&page=${page}`);
  }
}

export const tmdbApi = new TmdbApi();
