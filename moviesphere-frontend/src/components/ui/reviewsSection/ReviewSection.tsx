// src/components/ui/movieDetails/ReviewsSection.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import "./ReviewsSection.scss";
import ReviewCard from "../reviewCard/ReviewCard";

type Review = {
  id: string;
  author: string;
  author_details: {
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
};

type Props = {
  reviews: Review[];
  loading?: boolean;
  movieId: number;
};

export default function ReviewsSection({
  reviews,
  loading = false,
  movieId,
}: Props) {
  const { t } = useTranslation("movieDetails");

  if (loading) {
    return (
      <div className="reviews-section-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-review"></div>
        <div className="skeleton-review"></div>
        <div className="skeleton-review"></div>
      </div>
    );
  }

  if (!reviews.length) return null;

  return (
    <motion.div
      className="reviews-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="reviews-header">
        <div className="header-left">
          <h2>{t("reviews_title")}</h2>
        </div>
        <Link to={`/movie/${movieId}/reviews`} className="view-all-link">
          {t("view_all_reviews")} <FiExternalLink />
        </Link>
      </div>

      <div className="reviews-list">
        {reviews.slice(0, 3).map((review, idx) => (
          <ReviewCard
            key={review.id}
            review={review}
            maxPreviewLength={300}
            index={idx}
          />
        ))}
      </div>
    </motion.div>
  );
}
