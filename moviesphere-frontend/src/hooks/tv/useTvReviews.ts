// src/hooks/tv/useTvReviews.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { tvApi } from "../../services/tvApi";

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

type UseTvReviewsReturn = {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: boolean;
  setPage: (page: number) => void;
};

export function useTvReviews(
  tvId: number,
  initialPage: number = 1,
  perPage: number = 5,
): UseTvReviewsReturn {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const maxFetchedTmdbPage = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTmdbPage = useCallback(
    async (tmdbPage: number) => {
      if (maxFetchedTmdbPage.current >= tmdbPage) return;
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        const data = await tvApi.reviews(tvId, tmdbPage);
        const newReviews = data.results || [];
        setAllReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const uniqueNew = newReviews.filter(
            (r: Review) => !existingIds.has(r.id),
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
    [tvId],
  );

  useEffect(() => {
    if (!tvId) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const requiredCount = currentPage * perPage;
        const requiredTmdbPage = Math.ceil(requiredCount / 20);
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
  }, [tvId, currentPage, perPage, fetchTmdbPage]);

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paginatedReviews = allReviews.slice(start, end);

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
