// src/hooks/useMovieDetails.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";
import { useAppSelector } from "../redux/hooks";
import type { CastMember } from "../types/castMemberType";

type Genre = { id: number; name: string };
type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};
type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  budget: number;
  revenue: number;
  status: string;
  original_language: string;
  homepage: string | null;
};

type SimilarMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

// Cache for static fields (language‑independent) – keyed by id only
const staticMovieCache = new Map<
  number,
  {
    homepage: string | null;
    backdrop_path: string | null;
    poster_path: string | null;
  }
>();

// Cache for full localized movie data – keyed by id-language
const localizedMovieCache = new Map<string, Movie>();

// Separate caches for similar and cast (also keyed by id-language)
const similarCache = new Map<string, SimilarMovie[]>();
const castCache = new Map<string, CastMember[]>();

export function useMovieDetails(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const numericId = Number(id);
  const cacheKey = `${numericId}-${language}`;

  useEffect(() => {
    if (!numericId) return;

    let isMounted = true;

    const loadData = async () => {
      // 1. Restore static cache (homepage, posters) as placeholder movie
      if (staticMovieCache.has(numericId) && !movie) {
        const staticData = staticMovieCache.get(numericId)!;
        setMovie({
          id: numericId,
          title: "",
          overview: "",
          vote_average: 0,
          vote_count: 0,
          release_date: "",
          runtime: 0,
          tagline: "",
          genres: [],
          production_companies: [],
          budget: 0,
          revenue: 0,
          status: "",
          original_language: "",
          homepage: staticData.homepage,
          backdrop_path: staticData.backdrop_path,
          poster_path: staticData.poster_path,
        });
      }

      // 2. If all data is cached, use it and stop loading
      if (
        localizedMovieCache.has(cacheKey) &&
        similarCache.has(cacheKey) &&
        castCache.has(cacheKey)
      ) {
        setMovie(localizedMovieCache.get(cacheKey)!);
        setSimilar(similarCache.get(cacheKey)!);
        setCast(castCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      // 3. Otherwise fetch fresh data
      setLoading(true);
      setError(false);

      try {
        const [movieData, similarData, creditsData] = await Promise.all([
          moviesApi.details(numericId, language),
          moviesApi.getSimilar(numericId, 1, language),
          moviesApi.credits(numericId, language),
        ]);

        if (!isMounted) return;

        // Store static fields globally
        if (!staticMovieCache.has(numericId)) {
          staticMovieCache.set(numericId, {
            homepage: movieData.homepage,
            backdrop_path: movieData.backdrop_path,
            poster_path: movieData.poster_path,
          });
        }

        // Store localized data in respective caches
        localizedMovieCache.set(cacheKey, movieData);
        similarCache.set(cacheKey, similarData.results || []);
        castCache.set(cacheKey, creditsData.cast || []);

        setMovie(movieData);
        setSimilar(similarData.results || []);
        setCast(creditsData.cast || []);
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [numericId, language, cacheKey, movie]);

  const formatCurrency = (value: number) => {
    if (value === 0) return "N/A";
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRuntime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return {
    movie,
    similar,
    cast,
    loading,
    error,
    posterUrl,
    backdropUrl,
    formatCurrency,
    formatRuntime,
  };
}
