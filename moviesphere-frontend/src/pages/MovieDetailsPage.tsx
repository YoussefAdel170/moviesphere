// src/pages/MovieDetailsPage.tsx
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../redux/hooks";
import { useMovieDetails } from "../hooks/useMovieDetailsPage";
import MovieHero from "../components/ui/movieDetails/MovieHero";
import MovieOverview from "../components/ui/movieDetails/MovieOverview";
import MovieInfoGrid from "../components/ui/movieDetails/MovieInfoGrid";
import ProductionCompanies from "../components/ui/movieDetails/ProductionCompanies";
import CastCarousel from "../components/ui/castCarousel/CastCarousel";
import SimilarMoviesCarousel from "../components/ui/movieDetails/SimilarMoviesCarousel";
import AIRecommendations from "../components/ui/aiRecommendations/AIRecommendations";
import "./MovieDetailsPage.scss";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation(["movieDetails", "common"]);
  const { language } = useAppSelector((state) => state.movies); // ✅ moved before conditional returns
  const {
    movie,
    similar,
    cast,
    loading,
    error,
    posterUrl,
    backdropUrl,
    formatCurrency,
    formatRuntime,
  } = useMovieDetails(id);

  // ✅ Now it's safe to return early
  if (loading)
    return <div className="details-skeleton">{t("common:loading")}</div>;
  if (error || !movie)
    return <div className="details-error">{t("common:not_found")}</div>;

  const movieIdNumber = Number(id);
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <motion.div
      className="movie-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MovieHero
        title={movie.title}
        tagline={movie.tagline}
        releaseDate={movie.release_date}
        runtime={movie.runtime}
        voteAverage={movie.vote_average}
        voteCount={movie.vote_count}
        genres={movie.genres}
        posterUrl={posterUrl}
        backdropUrl={backdropUrl}
        homepage={movie.homepage}
        formatRuntime={formatRuntime}
        movieId={movieIdNumber}
        language={language}
      />

      <div className="content">
        <MovieOverview overview={movie.overview} />
        <MovieInfoGrid
          budget={movie.budget}
          revenue={movie.revenue}
          originalLanguage={movie.original_language}
          status={movie.status}
          formatCurrency={formatCurrency}
        />
        <ProductionCompanies companies={movie.production_companies} />
        {cast.length > 0 && (
          <CastCarousel cast={cast} movieId={movieIdNumber} />
        )}
        <SimilarMoviesCarousel similar={similar} movieId={movieIdNumber} />
        <AIRecommendations
          movieId={movieIdNumber}
          movieTitle={movie.title}
          movieYear={releaseYear}
          movieGenres={movie.genres.map((g) => g.name).join(", ")}
          movieOverview={movie.overview}
        />
      </div>
    </motion.div>
  );
}
