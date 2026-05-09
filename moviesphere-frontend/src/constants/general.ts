export const GENRES_INITIAL = 8;

export const TMDB_MIN_YEAR = 1900;

export const DEFAULT_LANGUAGE = "en-US";
export const DEFAULT_DIRECTION = "ltr";

export const DEFAULT_PAGE_NUMBER = 1;

export const LANGUAGE_OPTIONS = [
  { code: "en-US", label: "English" },
  { code: "ar", label: "العربية" },
];

export const SORT_BY_OPTIONS = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "release_date.desc", label: "Release Date Descending" },
  { value: "release_date.asc", label: "Release Date Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
];

export const SETTINGS_DEFAULT = {
  darkMode: false,
  language: DEFAULT_LANGUAGE,
  direction: DEFAULT_DIRECTION,

  filters: {
    genres: [],
    yearRange: [TMDB_MIN_YEAR, new Date().getFullYear()],
    voteAverage: 0,
    sortBy: "popularity.desc",
  },
};
