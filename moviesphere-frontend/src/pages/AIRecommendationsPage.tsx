// src/pages/AIRecommendationsPage.tsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAIRecommendationsPage } from "../hooks/Recommender/useAIRecommendationsPage";
import MovieCard from "../components/ui/moviecard/MovieCard";
import { normalizeMovie } from "../utils/normalizeMovie";
import MediaListPage from "./generic/MediaListPage";

export default function AIRecommendationsPage() {
  const { id } = useParams();
  const { t } = useTranslation("aiRecommendations");

  const {
    recommendations,
    loading,
    error,
    movieTitle,
    page,
    handlePageChange,
  } = useAIRecommendationsPage(id);

  const items = recommendations.results || [];
  const totalPages = recommendations.total_pages || 0;

  const renderMovieCard = (movie: any, index: number) => {
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
        index={index}
      />
    );
  };

  return (
    <MediaListPage
      items={items}
      loading={loading}
      error={!!error}
      errorMessage={error || t("error")}
      emptyStateConfig={{
        icon: "🤖",
        title: t("no_results_title", "No recommendations found"),
        message: t(
          "no_results",
          "We couldn't find AI recommendations for this movie.",
        ),
      }}
      backLinkTo={`/movie/${id}`}
      backLinkText={t("back_link", { title: movieTitle || t("movie") })}
      title={t("page_title", { title: movieTitle })}
      renderItem={renderMovieCard}
      pagination={{
        currentPage: page,
        totalPages,
        onPageChange: handlePageChange,
      }}
    />
  );
}
