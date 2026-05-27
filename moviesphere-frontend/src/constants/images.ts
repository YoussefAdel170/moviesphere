// src/constants/images.ts

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export const IMAGE_SIZES = {
  // Poster sizes (for movie posters)
  poster: {
    small: "w154", // 154px width (good for grids)
    medium: "w342", // 342px width (default for detail pages)
    large: "w500", // 500px width (high quality)
    original: "original",
  },
  // Backdrop sizes (horizontal backgrounds)
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  // Profile sizes (actor / cast photos)
  profile: {
    small: "w185", // compact cards
    medium: "w342", // better quality for larger cards
    large: "w500", // high detail
    original: "original",
  },
  // Logo sizes
  logo: {
    small: "w92",
    medium: "w154",
    large: "w500",
  },
};
