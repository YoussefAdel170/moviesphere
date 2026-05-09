// hooks/NavBar/useSearch.ts
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useDebounce } from "../useDebounce";
import { clearError } from "../../redux/features/movies/movieSlice";

export function useSearch() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useAppSelector((s) => s.movies);

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { debouncedValue: debouncedQuery, cancel: cancelDebounce } =
    useDebounce(query, 400);
  const skipNextDebounceRef = useRef(false);

  const onChangeQuery = (newQuery: string) => {
    setQuery(newQuery);
    if (error) dispatch(clearError());
  };

  // Debounced URL sync
  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }
    const safeQuery = debouncedQuery ?? "";
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const oldQuery = prev.get("query") || "";
      if (safeQuery.trim()) {
        newParams.set("query", safeQuery);
        if (oldQuery !== safeQuery) newParams.set("page", "1");
      } else {
        newParams.delete("query");
        if (oldQuery) newParams.set("page", "1");
      }
      return newParams;
    });
  }, [debouncedQuery, setSearchParams]);

  // Sync input when URL changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (urlQuery !== query) setQuery(urlQuery);
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (error) dispatch(clearError());
  };

  const clearSearch = () => {
    setQuery("");
    searchInputRef.current?.focus();
  };

  // NEW: safe home navigation that cancels debounce and clears URL
  const clearSearchAndGoHome = () => {
    cancelDebounce(); // stop pending debounce
    setQuery(""); // clear local state
    skipNextDebounceRef.current = true; // prevent URL writeback on next effect
    setSearchParams({}, { replace: true }); // remove ?query= from URL
    navigate("/", { replace: true });
  };

  const handleLogoClick = clearSearchAndGoHome; // reuse for logo

  return {
    query,
    searchInputRef,
    handleSearchChange,
    clearSearch,
    handleLogoClick,
    onChangeQuery,
    clearSearchAndGoHome, // expose new function
  };
}
