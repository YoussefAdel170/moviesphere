import { TextField } from "@mui/material";
import type { YearRangeFilterProps } from "../../../../types/movieFiltersTypes";
import { TMDB_MIN_YEAR } from "../../../../constants/general";
import { useTranslation } from "react-i18next";

export function YearRangeFilter({
  yearMinStr,
  yearMaxStr,
  localYearMin,
  localYearMax,
  currentYear,
  onYearMinChange,
  onYearMaxChange,
  onValidateYearMin,
  onValidateYearMax,
}: YearRangeFilterProps) {
  const { t } = useTranslation("filter");
  return (
    <div className="filter-section">
      <label>{t("year_range_title")}</label>

      <div className="year-range-inputs">
        <TextField
          type="number"
          label={t("year_from")}
          size="small"
          value={yearMinStr}
          onChange={onYearMinChange}
          onBlur={onValidateYearMin}
          slotProps={{
            htmlInput: {
              min: TMDB_MIN_YEAR,
              max: localYearMax,
            },
          }}
          sx={{ width: "100px" }}
        />

        <span>—</span>

        <TextField
          type="number"
          label={t("year_to")}
          size="small"
          value={yearMaxStr}
          onChange={onYearMaxChange}
          onBlur={onValidateYearMax}
          slotProps={{
            htmlInput: {
              min: localYearMin,
              max: currentYear,
            },
          }}
          sx={{ width: "100px" }}
        />
      </div>
    </div>
  );
}
