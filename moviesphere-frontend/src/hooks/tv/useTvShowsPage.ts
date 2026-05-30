import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchPopularTv,
  fetchTvWithFilters,
  searchTv,
} from "../../redux/features/tv/tvThunks";
import { hasActiveTvFilters } from "../../redux/features/tv/tvSlice";

export function useTvShowsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { shows, loading, error, pages, filters } = useAppSelector(
    (state) => state.tv,
  );

  const { language } = useAppSelector((state) => state.movies);

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    if (query) {
      dispatch(searchTv({ query, language }));
    } else if (hasActiveTvFilters(filters)) {
      dispatch(fetchTvWithFilters({ page, language, filters }));
    } else {
      dispatch(fetchPopularTv({ page, language }));
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
    shows,
    loading,
    error,
    pages,
    query,
    page,
    handlePageChange,
    clearSearch,
  };
}
