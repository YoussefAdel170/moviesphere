// src/hooks/Filter/useMovieFilter.ts

import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getGenreNames, genreTranslationKeys } from "../../utils/genreMap";
import { GENRES_INITIAL, TMDB_MIN_YEAR } from "../../constants/general";
import {
  setGenresFilter,
  setSortByFilter,
  setVoteAverageFilter,
  setYearRangeFilter,
} from "../../redux/features/movies/movieSlice";

export function useMovieFilters() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("genre");
  const { filters } = useAppSelector((state) => state.movies);

  const genres = useMemo(() => {
    return Object.entries(genreTranslationKeys).map(([id, key]) => ({
      id: parseInt(id, 10),
      name: t(key),
    }));
  }, [t]);

  // UI state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const currentYear = new Date().getFullYear();

  // Local filter state
  const [localGenres, setLocalGenres] = useState<number[]>(filters.genres);
  const [localYearMin, setLocalYearMin] = useState<number>(
    filters.yearRange[0],
  );
  const [localYearMax, setLocalYearMax] = useState<number>(
    filters.yearRange[1],
  );
  const [localVoteAvg, setLocalVoteAvg] = useState<number>(filters.voteAverage);
  const [localSortBy, setLocalSortBy] = useState<string>(filters.sortBy);
  const [yearMinStr, setYearMinStr] = useState<string>(localYearMin.toString());
  const [yearMaxStr, setYearMaxStr] = useState<string>(localYearMax.toString());
  const [showAllGenres, setShowAllGenres] = useState(false);

  const syncLocalFromRedux = () => {
    setLocalGenres(filters.genres);
    setLocalYearMin(filters.yearRange[0]);
    setLocalYearMax(filters.yearRange[1]);
    setLocalVoteAvg(filters.voteAverage);
    setLocalSortBy(filters.sortBy);
    setYearMinStr(filters.yearRange[0].toString());
    setYearMaxStr(filters.yearRange[1].toString());
  };

  useEffect(() => {
    if (open) {
      syncLocalFromRedux();
      setShowAllGenres(false);
    }
  }, [open, filters]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleGenreToggle = (id: number) => {
    setLocalGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleYearMinChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setYearMinStr(e.target.value);
  const handleYearMaxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setYearMaxStr(e.target.value);

  const validateYearMin = () => {
    let value = parseInt(yearMinStr, 10);
    if (isNaN(value)) value = TMDB_MIN_YEAR;
    value = Math.min(Math.max(value, TMDB_MIN_YEAR), localYearMax);
    setLocalYearMin(value);
    setYearMinStr(value.toString());
  };

  const validateYearMax = () => {
    let value = parseInt(yearMaxStr, 10);
    if (isNaN(value)) value = currentYear;
    value = Math.min(Math.max(value, localYearMin), currentYear);
    setLocalYearMax(value);
    setYearMaxStr(value.toString());
  };

  const handleApply = () => {
    dispatch(setGenresFilter(localGenres));
    dispatch(setYearRangeFilter([localYearMin, localYearMax]));
    dispatch(setVoteAverageFilter(localVoteAvg));
    dispatch(setSortByFilter(localSortBy));
    setAnchorEl(null);
  };

  const handleResetLocal = () => {
    setLocalGenres([]);
    setLocalYearMin(TMDB_MIN_YEAR);
    setLocalYearMax(currentYear);
    setLocalVoteAvg(0);
    setLocalSortBy("popularity.desc");
    setYearMinStr(TMDB_MIN_YEAR.toString());
    setYearMaxStr(currentYear.toString());
  };

  const displayedGenres = showAllGenres
    ? genres
    : genres.slice(0, GENRES_INITIAL);
  const hasMoreGenres = genres.length > GENRES_INITIAL;

  const activeFilterCount = () => {
    let count = 0;
    if (localGenres.length) count++;
    if (localYearMin > TMDB_MIN_YEAR || localYearMax < currentYear) count++;
    if (localVoteAvg > 0) count++;
    if (localSortBy !== "popularity.desc") count++;
    return count;
  };

  return {
    anchorEl,
    open,
    handleOpen,
    handleClose,
    genres,
    displayedGenres,
    localGenres,
    hasMoreGenres,
    showAllGenres,
    setShowAllGenres,
    handleGenreToggle,
    yearMinStr,
    yearMaxStr,
    localYearMin,
    localYearMax,
    currentYear,
    handleYearMinChange,
    handleYearMaxChange,
    validateYearMin,
    validateYearMax,
    localVoteAvg,
    setLocalVoteAvg,
    localSortBy,
    setLocalSortBy,
    handleApply,
    handleResetLocal,
    activeFilterCount,
  };
}
