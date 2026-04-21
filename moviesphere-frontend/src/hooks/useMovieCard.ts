import { useState } from "react";
import { useLocation } from "react-router-dom";

type UseMovieCardProps = {
  id: number;
  title?: string;
  poster_path?: string;
  vote_average?: number;
};

export function useMovieCard({
  id,
  title,
  poster_path,
  vote_average,
}: UseMovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const location = useLocation();

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  const showFallback = !posterUrl || imgError;

  const rating =
    vote_average !== undefined && vote_average !== null
      ? vote_average.toFixed(1)
      : "N/A";

  const to = {
    pathname: `/movie/${id}`,
    search: location.search,
  };

  const handleImageError = () => setImgError(true);

  return {
    posterUrl,
    showFallback,
    rating,
    to,
    handleImageError,
  };
}