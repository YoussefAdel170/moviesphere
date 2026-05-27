import { TMDB_IMAGE_BASE_URL } from "../../constants/images";

// Helper function to build full image URL
export const getImageUrl = (
  path: string | null | undefined,
  size: string,
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};
