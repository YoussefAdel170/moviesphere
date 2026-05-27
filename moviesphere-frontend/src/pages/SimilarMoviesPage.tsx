// src/pages/SimilarMoviesPage.tsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSimilarMoviesPage } from "../hooks/useSimilarMoviesPage";
import MovieCard from "../components/ui/moviecard/MovieCard";
import { normalizeMovie } from "../utils/normalizeMovie";
import MediaListPage from "./generic/MediaListPage";

export default function SimilarMoviesPage() {
  const { id } = useParams();
  const { t } = useTranslation("similarMoviesPage");

  const {
    movies,
    totalPages,
    loading,
    error,
    movieTitle,
    page,
    handlePageChange,
  } = useSimilarMoviesPage(id);

  const items = movies || [];
  const totalPagesNum = totalPages || 0;

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
      error={!!error} // convert to boolean
      errorMessage={t("error")} // ✅ always a string
      emptyStateConfig={{
        icon: "🎬",
        title: t("no_results_title", "No similar movies found"),
        message: t(
          "no_results",
          "We couldn't find similar movies for this title.",
        ),
      }}
      backLinkTo={`/movie/${id}`}
      backLinkText={t("back_link", { title: movieTitle || t("movie") })}
      title={t("page_title", { title: movieTitle })}
      renderItem={renderMovieCard}
      pagination={{
        currentPage: page,
        totalPages: totalPagesNum,
        onPageChange: handlePageChange,
      }}
    />
  );
}
