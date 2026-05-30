import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { useMovieReviews } from "../hooks/useMovieReviews";
import { useMovieDetails } from "../hooks/useMovieDetailsPage";
import { useTvReviews } from "../hooks/tv/useTvReviews";
import { useTvDetails } from "../hooks/tv/useTvDetails";
import Pagination from "../components/ui/pagination/Pagination";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import "./ReviewsPage.scss";
import ReviewCard from "../components/ui/reviewCard/ReviewCard";

export default function ReviewsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation("movieDetails");
  const mediaId = Number(id);
  const isMovie = location.pathname.includes("/movie/");
  const mediaType = isMovie ? "movie" : "tv";

  // ✅ Call ALL hooks unconditionally (they guard internally against invalid ids)
  const movieDetails = useMovieDetails(isMovie ? id : undefined);
  const tvDetails = useTvDetails(isMovie ? undefined : id);
  const movieReviews = useMovieReviews(isMovie ? mediaId : 0, 1, 5);
  const tvReviews = useTvReviews(isMovie ? 0 : mediaId, 1, 5);

  // Pick the correct data based on media type (with type assertions)
  const title = isMovie
    ? (movieDetails.movie as any)?.title
    : (tvDetails.tv as any)?.name;
  const detailsLoading = isMovie ? movieDetails.loading : tvDetails.loading;
  const detailsError = isMovie ? movieDetails.error : tvDetails.error;

  const reviewsData = isMovie ? movieReviews : tvReviews;
  const {
    reviews,
    totalPages,
    currentPage,
    loading: reviewsLoading,
    error: reviewsError,
    setPage,
  } = reviewsData;

  const isLoading = detailsLoading || reviewsLoading;
  const hasError = detailsError || reviewsError;
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
        <Link to={`/${mediaType}/${id}`} className="back-link">
          <FiArrowLeft /> {t("back_link", { title: title || t("movie") })}
        </Link>
      </div>
    );
  }

  const tmdbUrl = `https://www.themoviedb.org/${mediaType}/${mediaId}/reviews`;

  return (
    <motion.div
      className="reviews-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="header">
          <Link to={`/${mediaType}/${id}`} className="back-link">
            <FiArrowLeft /> {t("back_link", { title: title || t("movie") })}
          </Link>
          <div className="title-wrapper">
            <h1>{t("all_reviews_title")}</h1>
            <a
              href={tmdbUrl}
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
