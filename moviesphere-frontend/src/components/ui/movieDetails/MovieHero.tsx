// src/components/ui/movieDetails/MovieHero.tsx
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiClock,
  FiCalendar,
  FiStar,
  FiHome,
  FiExternalLink,
} from "react-icons/fi";
import { useMovieVideos } from "../../../hooks/useMovieVideos";
import { useState } from "react";
import TrailerModal from "../trailerModal/TrailerModal";

type Props = {
  title: string;
  tagline: string | null;
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  genres: { id: number; name: string }[];
  posterUrl: string | null;
  backdropUrl: string | null;
  homepage: string | null;
  formatRuntime: (minutes: number) => string;
  movieId: number;
  language: string;
};

export default function MovieHero({
  title,
  tagline,
  releaseDate,
  runtime,
  voteAverage,
  voteCount,
  genres,
  posterUrl,
  backdropUrl,
  homepage,
  formatRuntime,
  movieId,
  language,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation(["movieDetails", "common"]);
  const { videos, loading } = useMovieVideos(movieId, language);
  const [showModal, setShowModal] = useState(false);
  const trailer = videos[0];

  return (
    <div
      className="hero-section"
      style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none" }}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="action-buttons lg:mt-5 md:mt-5 mt-2">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label={t("common:back_aria")}
          >
            <FiArrowLeft /> {t("common:back")}
          </button>
          <Link
            to="/"
            className="home-button"
            aria-label={t("common:home_aria")}
          >
            <FiHome /> {t("common:home")}
          </Link>
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-button"
            >
              <FiExternalLink /> {t("common:official_site")}
            </a>
          )}
          {/* ✅ Trailer button inside same action-buttons container */}
          {trailer && !loading && (
            <button
              className="trailer-button"
              onClick={() => setShowModal(true)}
              aria-label={t("watch_trailer_aria", "Watch trailer")}
            >
              ▶ {t("watch_trailer", "Watch Trailer")}
            </button>
          )}
        </div>

        <div className="hero-info">
          <motion.img
            src={posterUrl || "/fallback-poster.png"}
            alt={t("movieDetails:poster_alt", { title })}
            className="poster mt-25"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <div className="details">
            <h1>{title}</h1>
            {tagline && <p className="tagline">"{tagline}"</p>}
            <div className="meta">
              <span>
                <FiCalendar /> {new Date(releaseDate).getFullYear()}
              </span>
              <span>
                <FiClock /> {formatRuntime(runtime)}
              </span>
              <span>
                <FiStar /> {voteAverage.toFixed(1)} (
                {t("movieDetails:votes", { count: voteCount })})
              </span>
            </div>
            <div className="genres">
              {genres.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          title={title}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
