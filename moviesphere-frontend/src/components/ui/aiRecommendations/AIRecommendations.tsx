// src/components/ui/aiRecommendations/AIRecommendations.tsx
import { useTranslation } from "react-i18next";
import { FiCpu } from "react-icons/fi";
import { useAIRecommendations } from "../../../hooks/Recommender/useAIRecommendations";
import MovieCarousel from "../utilities/MovieCarousel";

type Props = {
  movieId: number;
  movieTitle: string;
  movieYear: number;
  movieGenres: string;
  movieOverview: string;
};

export default function AIRecommendations({
  movieId,
  movieTitle,
  movieYear,
  movieGenres,
  movieOverview,
}: Props) {
  const { t } = useTranslation("aiRecommendations");
  const { recommendations, loading, error } = useAIRecommendations({
    title: movieTitle,
    year: movieYear,
    genres: movieGenres,
    overview: movieOverview,
  });

  return (
    <MovieCarousel
      items={recommendations}
      loading={loading}
      error={!!error}
      title={t("powered_picks", "✨ AI Powered Picks")}
      viewAllLink={
        recommendations.length > 10
          ? {
              to: `/movie/${movieId}/ai-recommend`,
              label: t("common:view_all", "View All"),
              icon: <FiCpu />,
            }
          : null
      }
    />
  );
}
