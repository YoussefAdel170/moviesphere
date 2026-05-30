// src/components/ui/filters/TvFilters.tsx
import {
  Select,
  MenuItem,
  Button,
  Popover,
  IconButton,
  Badge,
} from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import "./MovieFilters.scss";
import { StarRatingFilter } from "./subComponents/StarRatingFilter";
import { ActiveFilterChips } from "./subComponents/ActiveFilterChips";
import { GenreFilter } from "./subComponents/GenreFilter";
import { YearRangeFilter } from "./subComponents/YearRangeFilter";
import { useTvFilters } from "../../../hooks/Filter/useTvFilters";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../helper/tooltip/TooltipComponent";

export default function TvFilters() {
  const {
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
  } = useTvFilters();

  const { t } = useTranslation("filter");

  return (
    <div className="tv-filters">
      <TooltipComponent position="bottom" title={t("btn_filters_aria")}>
        <div className={`filter-trigger ${open ? "filter-trigger--open" : ""}`}>
          <Badge badgeContent={activeFilterCount()} color="primary">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleOpen}
              className="filter-button"
            >
              {t("btn_filters")}
            </Button>
          </Badge>
        </div>
      </TooltipComponent>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { className: "filter-popover" } }}
      >
        <div className="filter-popover-content">
          <div className="filter-header">
            <h4>{t("title")}</h4>
            <TooltipComponent position="bottom" title={t("close_aria")}>
              <IconButton size="small" onClick={handleClose}>
                <Close />
              </IconButton>
            </TooltipComponent>
          </div>

          <div className="filter-scrollable">
            <GenreFilter
              genres={genres}
              displayedGenres={displayedGenres}
              localGenres={localGenres}
              hasMoreGenres={hasMoreGenres}
              showAllGenres={showAllGenres}
              onToggleGenre={handleGenreToggle}
              onToggleShowMore={() => setShowAllGenres(!showAllGenres)}
            />

            <YearRangeFilter
              yearMinStr={yearMinStr}
              yearMaxStr={yearMaxStr}
              localYearMin={localYearMin}
              localYearMax={localYearMax}
              currentYear={currentYear}
              onYearMinChange={handleYearMinChange}
              onYearMaxChange={handleYearMaxChange}
              onValidateYearMin={validateYearMin}
              onValidateYearMax={validateYearMax}
            />

            <div className="filter-section">
              <label>{t("your_rating_title")}</label>
              <StarRatingFilter
                value={localVoteAvg}
                onChange={setLocalVoteAvg}
              />
            </div>

            <div className="filter-section">
              <label>{t("sort_by_title")}</label>
              <Select
                fullWidth
                value={localSortBy}
                onChange={(e) => setLocalSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="popularity.desc">
                  {t("sort_by.popularity_desc")}
                </MenuItem>
                <MenuItem value="vote_average.desc">
                  {t("sort_by.vote_average_desc")}
                </MenuItem>
                <MenuItem value="first_air_date.desc">
                  {t("sort_by.first_air_date_desc")}
                </MenuItem>
              </Select>
            </div>
          </div>

          <div className="filter-actions">
            <TooltipComponent position="bottom" title={t("reset_aria")}>
              <Button fullWidth variant="outlined" onClick={handleResetLocal}>
                {t("reset_local")}
              </Button>
            </TooltipComponent>
            <TooltipComponent position="bottom" title={t("apply_filters_aria")}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApply}
                sx={{ mt: 1 }}
              >
                {t("apply_filters")}
              </Button>
            </TooltipComponent>
          </div>
        </div>
      </Popover>

      <ActiveFilterChips />
    </div>
  );
}
