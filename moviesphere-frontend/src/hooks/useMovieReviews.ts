// src/hooks/useMovieReviews.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { moviesApi } from "../services/moviesApi";

export type ReviewAuthor = {
  username: string;
  avatar_path: string | null;
  rating: number | null;
};

export type Review = {
  id: string;
  author: string;
  author_details: ReviewAuthor;
  content: string;
  created_at: string;
  url: string;
};

type UseMovieReviewsReturn = {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: boolean;
  setPage: (page: number) => void;
};

export function useMovieReviews(
  movieId: number,
  initialPage: number = 1,
  perPage: number = 5,
): UseMovieReviewsReturn {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const maxFetchedTmdbPage = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch a specific TMDB page (20 reviews) and append to allReviews
  const fetchTmdbPage = useCallback(
    async (tmdbPage: number) => {
      if (maxFetchedTmdbPage.current >= tmdbPage) return;
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        const data = await moviesApi.reviews(movieId, tmdbPage);
        const newReviews = data.results || [];
        setAllReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const uniqueNew = newReviews.filter(
            (r: { id: string }) => !existingIds.has(r.id),
          );
          return [...prev, ...uniqueNew];
        });
        setTotalAvailable((prev) => Math.max(prev, data.total_results || 0));
        maxFetchedTmdbPage.current = tmdbPage;
      } catch (err) {
        setError(true);
        throw err;
      }
    },
    [movieId],
  );

  // When currentPage changes, fetch required TMDB pages to have enough reviews
  useEffect(() => {
    if (!movieId) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const requiredCount = currentPage * perPage;
        const requiredTmdbPage = Math.ceil(requiredCount / 20);
        // Fetch sequentially until we have enough pages
        for (
          let p = maxFetchedTmdbPage.current + 1;
          p <= requiredTmdbPage;
          p++
        ) {
          if (!isMounted) return;
          await fetchTmdbPage(p);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [movieId, currentPage, perPage, fetchTmdbPage]);

  // Slice the reviews for the current page
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paginatedReviews = allReviews.slice(start, end);

  // Total pages based on total available reviews (we may have more than fetched, so we use totalAvailable from API)
  // However, totalAvailable is only known after first fetch. We'll estimate from API total_results.
  // We'll update totalAvailable when fetching each TMDB page.
  // For now, use totalAvailable (set from API) to compute pages.
  const totalPages =
    totalAvailable > 0 ? Math.ceil(totalAvailable / perPage) : 0;

  return {
    reviews: paginatedReviews,
    totalPages,
    currentPage,
    loading,
    error,
    setPage: setCurrentPage,
  };
}
