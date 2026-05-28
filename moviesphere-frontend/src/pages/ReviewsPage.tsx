// src/pages/ReviewsPage.tsx
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { useMovieReviews } from "../hooks/useMovieReviews";
import { useMovieDetails } from "../hooks/useMovieDetailsPage";
import Pagination from "../components/ui/pagination/Pagination";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import "./ReviewsPage.scss";
import ReviewCard from "../components/ui/reviewCard/ReviewCard";

export default function ReviewsPage() {
  const { id } = useParams();
  const { t } = useTranslation("movieDetails");
  const movieId = Number(id);

  // Fetch movie details
  const {
    movie,
    loading: movieLoading,
    error: movieError,
  } = useMovieDetails(id);
  // Fetch reviews (5 per page)
  const { reviews, totalPages, currentPage, loading, error, setPage } =
    useMovieReviews(movieId, 1, 5);

  const isLoading = movieLoading || loading;
  const hasError = movieError || error;
  const isEmpty = !isLoading && !hasError && reviews.length === 0;

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <SkeletonGrid />;
  if (hasError)
    return <div className="reviews-error">{t("error_loading_reviews")}</div>;
  if (isEmpty) {
    return (
      <div className="reviews-empty">
        <div className="empty-icon">📝</div>
        <h2>{t("no_reviews_title")}</h2>
        <p>{t("no_reviews_message")}</p>
        <Link to={`/movie/${id}`} className="back-link">
          <FiArrowLeft /> {t("back_to_movie")}
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="reviews-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="header">
          <Link to={`/movie/${id}`} className="back-link">
            <FiArrowLeft />{" "}
            {t("back_link", { title: movie?.title || t("movie") })}
          </Link>
          <div className="title-wrapper">
            <h1>{t("all_reviews_title")}</h1>
            <a
              href={`https://www.themoviedb.org/movie/${movieId}/reviews`}
              target="_blank"
              rel="noopener noreferrer"
              className="tmdb-link"
            >
              TMDB <FiExternalLink />
            </a>
          </div>
        </div>

        <motion.div
          className="reviews-list"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {reviews.map((review, idx) => (
            <ReviewCard key={review.id} review={review} index={idx} />
          ))}
        </motion.div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </motion.div>
  );
}
