// src/hooks/useMoviesPage.ts
import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchPopularMovies,
  searchMovies,
  fetchMoviesWithFilters,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../redux/features/movies/moviesThunks";
import { hasActiveFilters } from "../redux/features/movies/movieSlice";

export function useMoviesPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { movies, loading, error, pages, language, filters } = useAppSelector(
    (state) => state.movies,
  );

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const trending = searchParams.get("trending");
  const upcoming = searchParams.get("upcoming");

  useEffect(() => {
    if (query) dispatch(searchMovies({ query, language }));
    else if (trending) {
      const timeWindow = trending === "week" ? "week" : "day";
      dispatch(fetchTrendingMovies({ timeWindow, language, page }));
    } else if (upcoming === "true") {
      dispatch(fetchUpcomingMovies({ page, language }));
    } else if (hasActiveFilters(filters)) {
      dispatch(fetchMoviesWithFilters({ page, language, filters }));
    } else {
      dispatch(fetchPopularMovies({ page, language }));
    }
  }, [dispatch, query, trending, upcoming, page, language, filters]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [query, page, filters, trending, upcoming]);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchParams({ page: "1" });
  };

  return {
    movies,
    loading,
    error,
    pages,
    query,
    page,
    handlePageChange,
    clearSearch,
  };
}
