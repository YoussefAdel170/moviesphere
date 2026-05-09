// src/hooks/useMoviesPage.ts
import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchPopularMovies,
  searchMovies,
  fetchMoviesWithFilters,
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

  useEffect(() => {
    if (query) {
      dispatch(searchMovies({ query, language }));
    } else if (hasActiveFilters(filters)) {
      dispatch(fetchMoviesWithFilters({ page, language, filters }));
    } else {
      dispatch(fetchPopularMovies({ page, language }));
    }
  }, [query, page, language, filters, dispatch]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [query, page, filters]);

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
