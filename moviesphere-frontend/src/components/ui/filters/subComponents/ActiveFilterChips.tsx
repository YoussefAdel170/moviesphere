import { Chip } from "@mui/material";
import { useActiveFilterChips } from "../../../../hooks/Filter/useActiveFilterChips";
import { useTranslation } from "react-i18next";
import { TMDB_MIN_YEAR } from "../../../../constants/general";
import TooltipComponent from "../../helper/tooltip/TooltipComponent";

export function ActiveFilterChips() {
  const result = useActiveFilterChips();

  const { t } = useTranslation("filter");

  if (!result) {
    return <div className="active-filter-chips" />;
  }

  const {
    filters,
    getGenreName,
    handleRemoveGenre,
    handleRemoveYear,
    handleRemoveRating,
    handleRemoveSort,
    handleResetAll,
    currentYear,
    getSortLabel,
  } = result;

  return (
    <div className="active-filter-chips">
      {filters.genres.map((id) => (
        <TooltipComponent
          position="bottom"
          key={id}
          title={t("remove_filter_with_value", {
            value: getGenreName(id),
          })}
        >
          <Chip
            label={getGenreName(id)}
            onDelete={() => handleRemoveGenre(id)}
            size="small"
            className="filter-chip"
          />
        </TooltipComponent>
      ))}

      {(filters.yearRange[0] > TMDB_MIN_YEAR ||
        filters.yearRange[1] < currentYear) && (
        <TooltipComponent position="bottom" title={t("remove_year_filter")}>
          <Chip
            label={`${filters.yearRange[0]}–${filters.yearRange[1]}`}
            onDelete={handleRemoveYear}
            size="small"
            className="filter-chip"
          />
        </TooltipComponent>
      )}

      {filters.voteAverage > 0 && (
        <TooltipComponent position="bottom" title={t("remove_rating_filter")}>
          <Chip
            label={`Rating ≥ ${filters.voteAverage}`}
            onDelete={handleRemoveRating}
            size="small"
            className="filter-chip"
          />
        </TooltipComponent>
      )}

      {filters.sortBy !== "popularity.desc" && (
        <TooltipComponent position="bottom" title={t("remove_sort_filter")}>
          <Chip
            label={getSortLabel(filters.sortBy)} // ← now uses the map
            onDelete={handleRemoveSort}
            size="small"
            className="filter-chip"
          />
        </TooltipComponent>
      )}

      <TooltipComponent position="bottom" title={t("reset_aria")}>
        <Chip
          label={t("clear_all")}
          onClick={handleResetAll}
          size="small"
          className="filter-chip clear-all"
        />
      </TooltipComponent>
    </div>
  );
}
