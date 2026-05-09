import { Chip } from "@mui/material";
import { useActiveFilterChips } from "../../../../hooks/Filter/useActiveFilterChips";
import { useTranslation } from "react-i18next";

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
  } = result;

  return (
    <div className="active-filter-chips">
      {filters.genres.map((id) => (
        <Chip
          key={id}
          label={getGenreName(id)}
          onDelete={() => handleRemoveGenre(id)}
          size="small"
          className="filter-chip"
        />
      ))}

      {(filters.yearRange[0] > 1900 || filters.yearRange[1] < currentYear) && (
        <Chip
          label={`${filters.yearRange[0]}–${filters.yearRange[1]}`}
          onDelete={handleRemoveYear}
          size="small"
          className="filter-chip"
        />
      )}

      {filters.voteAverage > 0 && (
        <Chip
          label={`Rating ≥ ${filters.voteAverage}`}
          onDelete={handleRemoveRating}
          size="small"
          className="filter-chip"
        />
      )}

      {filters.sortBy !== "popularity.desc" && (
        <Chip
          label={`Sort: ${filters.sortBy.replace("_", " ")}`}
          onDelete={handleRemoveSort}
          size="small"
          className="filter-chip"
        />
      )}

      <Chip
        label={t("clear_all")}
        onClick={handleResetAll}
        size="small"
        className="filter-chip clear-all"
      />
    </div>
  );
}
