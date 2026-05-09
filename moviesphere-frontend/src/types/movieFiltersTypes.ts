export interface GenreFilterProps {
  genres: { id: number; name: string }[];
  displayedGenres: { id: number; name: string }[];
  localGenres: number[];
  hasMoreGenres: boolean;
  showAllGenres: boolean;
  onToggleGenre: (id: number) => void;
  onToggleShowMore: () => void;
}

export interface StarRatingFilterProps {
  value: number;
  onChange: (val: number) => void;
}

export interface YearRangeFilterProps {
  yearMinStr: string;
  yearMaxStr: string;
  localYearMin: number;
  localYearMax: number;
  currentYear: number;
  onYearMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYearMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidateYearMin: () => void;
  onValidateYearMax: () => void;
}
