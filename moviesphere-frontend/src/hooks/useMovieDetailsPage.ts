// src/hooks/useMovieDetails.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";
import { useAppSelector } from "../redux/hooks";

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

export function useMovieDetails(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    Promise.all([
      moviesApi.details(Number(id), language),
      moviesApi.getSimilar(Number(id), 1, language),
    ])
      .then(([movieData, similarData]) => {
        if (isMounted) {
          setMovie(movieData);
          setSimilar(similarData.results?.slice(0, 5) || []);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, language]);

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
    loading,
    error,
    posterUrl,
    backdropUrl,
    formatCurrency,
    formatRuntime,
  };
}
