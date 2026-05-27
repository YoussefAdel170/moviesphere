// src/components/ui/movieDetails/SimilarMoviesCarousel.tsx
import { useTranslation } from "react-i18next";
import { FiFilm } from "react-icons/fi";
import MovieCarousel from "../utilities/MovieCarousel";

type Props = {
  similar: any[];
  movieId: number;
};

export default function SimilarMoviesCarousel({ similar, movieId }: Props) {
  const { t } = useTranslation("movieDetails");

  if (!similar.length) return null;

  return (
    <MovieCarousel
      items={similar}
      title={t("tmdb_recommends")}
      viewAllLink={{
        to: `/movie/${movieId}/similar`,
        label: t("common:view_all"),
        icon: <FiFilm />,
      }}
    />
  );
}
