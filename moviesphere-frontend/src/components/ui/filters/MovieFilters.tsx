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
import { useMovieFilters } from "../../../hooks/Filter/useMovieFilter";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../helper/tooltip/TooltipComponent";

// ----------------------------------------------------------------------
// Main Filter Component
// ----------------------------------------------------------------------
export default function MovieFilters() {
  const {
    // UI state
    anchorEl,
    open,

    // handlers
    handleOpen,
    handleClose,

    // genres
    genres,
    displayedGenres,
    localGenres,
    hasMoreGenres,
    showAllGenres,
    setShowAllGenres,
    handleGenreToggle,

    // year
    yearMinStr,
    yearMaxStr,
    localYearMin,
    localYearMax,
    currentYear,
    handleYearMinChange,
    handleYearMaxChange,
    validateYearMin,
    validateYearMax,

    // rating
    localVoteAvg,
    setLocalVoteAvg,

    // sort
    localSortBy,
    setLocalSortBy,

    // actions
    handleApply,
    handleResetLocal,

    // meta
    activeFilterCount,
  } = useMovieFilters();

  const { t } = useTranslation("filter");
  return (
    <div className="movie-filters">
      {/* Filter Trigger */}
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

      {/* Filter Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            className: "filter-popover",
          },
        }}
      >
        <div className="filter-popover-content">
          {/* Filter Popover Header */}
          <div className="filter-header">
            {/* Filter Title */}
            <h4>{t("title")}</h4>

            {/* Close Button */}
            <TooltipComponent position="bottom" title={t("close_aria")}>
              <IconButton size="small" onClick={handleClose}>
                <Close />
              </IconButton>
            </TooltipComponent>
          </div>

          {/* Filter Content */}
          <div className="filter-scrollable">
            {/* Genre Filter */}
            <GenreFilter
              genres={genres}
              displayedGenres={displayedGenres}
              localGenres={localGenres}
              hasMoreGenres={hasMoreGenres}
              showAllGenres={showAllGenres}
              onToggleGenre={handleGenreToggle}
              onToggleShowMore={() => setShowAllGenres(!showAllGenres)}
            />

            {/* Year Range */}
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
            {/* Rating */}

            <div className="filter-section">
              <label>{t("your_rating_title")}</label>

              <StarRatingFilter
                value={localVoteAvg}
                onChange={setLocalVoteAvg}
              />
            </div>

            {/* Sort */}
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

                <MenuItem value="release_date.desc">
                  {t("sort_by.release_date_desc")}
                </MenuItem>

                <MenuItem value="revenue.desc">
                  {t("sort_by.revenue_desc")}
                </MenuItem>
              </Select>
            </div>
          </div>

          {/* Actions */}
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
