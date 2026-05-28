// src/components/ui/reviews/ReviewCard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiUser, FiStar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getImageUrl } from "../../../hooks/utilities/useImageUrl";
import { IMAGE_SIZES } from "../../../constants/images";
import "./ReviewCard.scss";

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
  review: Review;
  maxPreviewLength?: number;
  index?: number;
};

export default function ReviewCard({
  review,
  maxPreviewLength = 400,
  index = 0,
}: Props) {
  const { t } = useTranslation("movieDetails");
  const [isExpanded, setIsExpanded] = useState(false);
  const avatarUrl = review.author_details.avatar_path
    ? getImageUrl(review.author_details.avatar_path, IMAGE_SIZES.profile.small)
    : null;
  const content = review.content;
  const isLong = content.length > maxPreviewLength;
  const displayContent = isExpanded
    ? content
    : content.slice(0, maxPreviewLength);

  return (
    <motion.div
      className="review-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="review-header">
        <div className="review-author">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={review.author}
              className="author-avatar"
            />
          ) : (
            <div className="author-avatar-placeholder">
              <FiUser />
            </div>
          )}
          <div className="author-info">
            <strong>{review.author}</strong>
            {review.author_details.rating && (
              <span className="author-rating">
                <FiStar /> {review.author_details.rating}/10
              </span>
            )}
          </div>
        </div>
        <div className="review-date">
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="review-content">
        <p>
          {displayContent}
          {!isExpanded && isLong && "…"}
        </p>
        {isLong && (
          <button
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                {t("show_less")} <FiChevronUp />
              </>
            ) : (
              <>
                {t("read_more")} <FiChevronDown />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
