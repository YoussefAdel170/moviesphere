// src/hooks/useHomePage.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchPopularMovies,
  fetchTrendingAll,
  fetchUpcomingMovies,
} from "../redux/features/movies/moviesThunks";
import { fetchPopularTv } from "../redux/features/tv/tvThunks";

export function useHomePage() {
  const dispatch = useAppDispatch();

  const language = useAppSelector((state) => state.movies?.language ?? "en-US");
  const trendingAll = useAppSelector(
    (state) => state.movies?.trendingAll ?? [],
  );
  const popularMovies = useAppSelector((state) => state.movies?.movies ?? []);
  const popularTv = useAppSelector((state) => state.tv?.shows ?? []);
  const upcomingMovies = useAppSelector(
    (state) => state.movies?.upcomingMovies ?? [],
  );

  // Single selector for loading — no double hook call
  const moviesLoading = useAppSelector(
    (state) => state.movies?.loading ?? false,
  );
  const tvLoading = useAppSelector((state) => state.tv?.loading ?? false);
  const isLoading = moviesLoading || tvLoading;

  useEffect(() => {
    if (!language) return;

    // All fetches are independent — run in parallel
    Promise.all([
      dispatch(fetchTrendingAll({ language })),
      dispatch(fetchPopularMovies({ page: 1, language })),
      dispatch(fetchPopularTv({ page: 1, language })),
      dispatch(fetchUpcomingMovies({ page: 1, language })),
    ]);
  }, [dispatch, language]);

  return {
    trendingAll,
    popularMovies,
    popularTv,
    upcomingMovies,
    isLoading,
  };
}
