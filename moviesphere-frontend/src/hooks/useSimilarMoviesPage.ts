// src/hooks/useSimilarMoviesPage.ts
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { moviesApi } from "../services/moviesApi";
import { useAppSelector } from "../redux/hooks";

type SimilarMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

export function useSimilarMoviesPage(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<SimilarMovie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    // Fetch current movie title and similar movies in parallel
    Promise.all([
      moviesApi.details(Number(id), language),
      moviesApi.getSimilar(Number(id), page, language),
    ])
      .then(([detailsData, similarData]) => {
        if (isMounted) {
          setMovieTitle(detailsData.title);
          setMovies(similarData.results || []);
          setTotalPages(Math.min(similarData.total_pages || 1, 500)); // TMDB limit
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
  }, [id, page, language]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    movies,
    totalPages,
    loading,
    error,
    movieTitle,
    page,
    handlePageChange,
  };
}
