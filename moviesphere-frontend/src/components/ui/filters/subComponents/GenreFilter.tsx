// src/components/MovieFilters/subComponents/GenreFilter.tsx

import { Button, Chip } from "@mui/material";
import type { GenreFilterProps } from "../../../../types/movieFiltersTypes";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../../helper/tooltip/TooltipComponent";

export function GenreFilter({
  displayedGenres,
  localGenres,
  hasMoreGenres,
  showAllGenres,
  onToggleGenre,
  onToggleShowMore,
}: GenreFilterProps) {
  const { t } = useTranslation("filter");
  return (
    <div className="filter-section">
      <label>{t("genres_title")}</label>
      <div className="genres-wrapper">
        {displayedGenres.map((genre) => (
          <Chip
            key={genre.id}
            label={t(genre.name)}
            size="small"
            clickable
            color={localGenres.includes(genre.id) ? "primary" : "default"}
            onClick={() => onToggleGenre(genre.id)}
          />
        ))}
        {hasMoreGenres && (
          <TooltipComponent
            position="top"
            title={showAllGenres ? t("show_less") : t("show_more")}
          >
            <Button size="small" onClick={onToggleShowMore}>
              {showAllGenres ? t("show_less") : t("show_more")}
            </Button>
          </TooltipComponent>
        )}
      </div>
    </div>
  );
}
