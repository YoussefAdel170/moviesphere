import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MovieCard from "../moviecard/MovieCard";
import { useAIRecommendations } from "../../../hooks/Recommender/useAIRecommendations";
import SkeletonGrid from "../SkeletonGrid";
import { normalizeMovie } from "../../../utils/normalizeMovie";
import "./AIRecommendations.scss";

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

  const showCount = 5;
  const displayed = recommendations.slice(0, showCount);
  const hasMore = recommendations.length > showCount;

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="similar-movies">
        <div className="similar-header">
          <h2>✨ {t("analyzing")}</h2>
        </div>
        <SkeletonGrid />
      </div>
    );
  }

  /* =========================
     EMPTY
  ========================= */
  if (error || recommendations.length === 0) {
    return null;
  }

  /* =========================
     SUCCESS
  ========================= */
  return (
    <section className="similar-movies">
      <div className="similar-header">
        <h2>{t("powered_picks")}</h2>

        {hasMore && (
          <Link
            to={`/movie/${movieId}/ai-recommend`}
            className="view-more-link"
          >
            {t("common:view_all")}
          </Link>
        )}
      </div>

      <div className="similar-grid">
        {displayed.map((movie, idx) => {
          const normalized = normalizeMovie(movie);

          return (
            <MovieCard
              key={normalized.id}
              id={normalized.id}
              title={normalized.title}
              poster_path={normalized.poster_path}
              vote_average={normalized.vote_average}
              overview={normalized.overview}
              genre_ids={normalized.genre_ids}
              index={idx}
            />
          );
        })}
      </div>
    </section>
  );
}
