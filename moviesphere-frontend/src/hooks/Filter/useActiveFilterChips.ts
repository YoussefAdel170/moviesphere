import { useTranslation } from "react-i18next";
import {
  resetFilters,
  setGenresFilter,
  setSortByFilter,
  setVoteAverageFilter,
  setYearRangeFilter,
} from "../../redux/features/movies/movieSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { genreTranslationKeys } from "../../utils/genreMap";
import { TMDB_MIN_YEAR } from "../../constants/general";

export function useActiveFilterChips() {
  const { t } = useTranslation("filter");
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.movies);
  const currentYear = new Date().getFullYear();

  const hasActive =
    filters.genres.length > 0 ||
    filters.yearRange[0] > TMDB_MIN_YEAR ||
    filters.yearRange[1] < currentYear ||
    filters.voteAverage > 0 ||
    filters.sortBy !== "popularity.desc";

  if (!hasActive) {
    return null;
  }

  // In useActiveFilterChips.ts

  const SORT_LABELS: Record<string, string> = {
    "popularity.desc": t("sort_by.popularity_desc"),
    "popularity.asc": t("sort_by.popularity_asc"),
    "vote_average.desc": t("sort_by.vote_average_desc"),
    "vote_average.asc": t("sort_by.vote_average_asc"),
    "release_date.desc": t("sort_by.release_date_desc"),
    "release_date.asc": t("sort_by.release_date_asc"),
    "revenue.desc": t("sort_by.revenue_desc"),
  };

  const getSortLabel = (sort: string): string => SORT_LABELS[sort] ?? sort; // shows raw key only if truly missing

  const handleRemoveGenre = (id: number) =>
    dispatch(setGenresFilter(filters.genres.filter((g) => g !== id)));

  const handleRemoveYear = () =>
    dispatch(setYearRangeFilter([1900, currentYear]));

  const handleRemoveRating = () => dispatch(setVoteAverageFilter(0));

  const handleRemoveSort = () => dispatch(setSortByFilter("popularity.desc"));

  const handleResetAll = () => dispatch(resetFilters());

  const getGenreName = (id: number) => {
    const key = genreTranslationKeys[id];
    return key ? t(`genre:${key}`) : `Genre ${id}`;
  };

  return {
    filters,
    getGenreName,
    handleRemoveGenre,
    handleRemoveYear,
    handleRemoveRating,
    handleRemoveSort,
    handleResetAll,
    currentYear,
    getSortLabel,
  };
}
