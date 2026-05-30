// src/pages/MovieDetailsPage.tsx
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../redux/hooks";
import { useMovieDetails } from "../hooks/useMovieDetailsPage";
import { useMovieReviews } from "../hooks/useMovieReviews"; // ✅ Import the hook
import MovieHero from "../components/ui/movieDetails/MovieHero";
import MovieOverview from "../components/ui/movieDetails/MovieOverview";
import MovieInfoGrid from "../components/ui/movieDetails/MovieInfoGrid";
import ProductionCompanies from "../components/ui/movieDetails/ProductionCompanies";
import CastCarousel from "../components/ui/castCarousel/CastCarousel";
import AIRecommendations from "../components/ui/aiRecommendations/AIRecommendations";
import "./MovieDetailsPage.scss";
import ReviewsSection from "../components/ui/reviewsSection/ReviewSection";
import SimilarCarousel from "../components/ui/utilities/SimilarCarousel";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation(["movieDetails", "common"]);
  const { language } = useAppSelector(
    (state: { movies: { language: string } }) => state.movies,
  );
  const movieIdNumber = Number(id);

  // ✅ ALL hooks are now called at the top level, before any conditional logic
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

  const { reviews, loading: reviewsLoading } = useMovieReviews(
    movieIdNumber,
    1,
    3,
  );

  // ✅ Early returns happen AFTER all hooks have been called
  if (loading)
    return <div className="details-skeleton">{t("common:loading")}</div>;
  if (error || !movie)
    return <div className="details-error">{t("common:not_found")}</div>;

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
        <SimilarCarousel
          items={similar}
          id={movieIdNumber}
          mediaType="movie"
          titleKey="tmdb_recommends"
        />
        <AIRecommendations
          movieId={movieIdNumber}
          movieTitle={movie.title}
          movieYear={releaseYear}
          movieGenres={movie.genres.map((g) => g.name).join(", ")}
          movieOverview={movie.overview}
        />

        {/* ✅ The ReviewsSection is now safe to render */}
        {!reviewsLoading && reviews.length > 0 && (
          <ReviewsSection
            reviews={reviews}
            loading={reviewsLoading}
            id={movieIdNumber}
          />
        )}
      </div>
    </motion.div>
  );
}
