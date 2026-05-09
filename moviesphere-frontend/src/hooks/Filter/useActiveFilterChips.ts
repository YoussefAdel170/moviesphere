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

export function useActiveFilterChips() {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.movies);
  const currentYear = new Date().getFullYear();

  const hasActive =
    filters.genres.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < currentYear ||
    filters.voteAverage > 0 ||
    filters.sortBy !== "popularity.desc";

  if (!hasActive) {
    return null;
  }

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
  };
}
