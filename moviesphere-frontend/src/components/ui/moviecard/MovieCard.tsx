import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilm } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useMovieCard } from "../../../hooks/useMovieCard";
import { getGenreNames } from "../../../utils/genreMap";
import "./MovieCard.scss";

type Props = {
  id: number;
  title?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
  index?: number;
};

function MovieCard({
  id,
  title,
  poster_path,
  vote_average,
  overview,
  genre_ids = [],
  index = 0,
}: Props) {
  const { t } = useTranslation("movieCard");

  const {
    posterUrl,
    showFallback,
    rating,
    to,
    handleImageError,
  } = useMovieCard({
    id,
    title,
    poster_path,
    vote_average,
  });

  // ✅ Use the translated utility
  const genres = useMemo(() => {
    return getGenreNames(genre_ids, t);
  }, [genre_ids, t]);

  const ariaLabel = useMemo(() => {
    return t("aria_card_label", {
      title: title || t("unknown_title"),
      rating,
    });
  }, [title, rating, t]);

  return (
    <motion.article
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      aria-label={ariaLabel}
    >
      <Link to={to}>
        <div className="movie-card__image">
          {!showFallback ? (
            <img
              src={posterUrl!}
              alt={t("poster_alt", { title: title || t("unknown_title") })}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="movie-card__fallback">
              <FiFilm className="fallback-icon" aria-hidden="true" />
              <span className="fallback-title">
                {title ? title.slice(0, 30) : t("unknown_title")}
              </span>
            </div>
          )}

          <div className="movie-card__overlay">
            <span>⭐ {rating}</span>
          </div>

          <div className="movie-card__hover-overlay">
            <div className="overlay-content">
              {overview && (
                <p className="overview" title={overview}>
                  {overview}
                </p>
              )}

              {genres.length > 0 && (
                <div className="genres">
                  {genres.map((genre) => (
                    <span key={genre}>{genre}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="movie-card__info">
          <h3>{title || t("unknown_title")}</h3>
        </div>
      </Link>
    </motion.article>
  );
}

export default React.memo(MovieCard);