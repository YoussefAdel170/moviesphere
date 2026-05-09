import type { StarRatingFilterProps } from "../../../../types/movieFiltersTypes";
import { useStarRatingFilter } from "../../../../hooks/Filter/useStarRatingFilterHook";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export function StarRatingFilter({ value, onChange }: StarRatingFilterProps) {
  const { getStarState, handleStarClick, handleMouseMove, handleMouseLeave } =
    useStarRatingFilter(value, onChange);

  const { t } = useTranslation("filter");

  const renderStar = (starIndex: number) => {
    const state = getStarState(starIndex);

    if (state === "full") {
      return <FaStar className="star full" />;
    }

    if (state === "half") {
      return <FaStarHalfAlt className="star half" />;
    }

    return <FaRegStar className="star empty" />;
  };

  return (
    <div className="star-rating-filter">
      <div className="stars" onMouseLeave={handleMouseLeave}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="star-wrapper"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const isHalf = mouseX < rect.width / 2;

              handleStarClick(i, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(i, e)}
          >
            {renderStar(i)}
          </span>
        ))}
      </div>

      <div className="rating-label">
        {t("stars_rating_title")}: <strong>{value.toFixed(1)}+</strong>
      </div>
    </div>
  );
}
