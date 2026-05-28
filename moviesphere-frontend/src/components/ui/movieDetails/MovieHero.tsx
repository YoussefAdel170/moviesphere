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
  FiPlay,
  FiShield,
} from "react-icons/fi";
import { useMovieVideos } from "../../../hooks/useMovieVideos";
import { useWatchProviders } from "../../../hooks/useWatchProviders";
import { useMovieHomepage } from "../../../hooks/useMovieHomepage";
import { useState } from "react";
import TrailerModal from "../trailerModal/TrailerModal";
import WatchProviders from "../watchProviders/WatchProviders";
import { useMovieCertification } from "../../../hooks/useMovieCertification";
import TooltipComponent from "../helper/tooltip/TooltipComponent";

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
  formatRuntime,
  movieId,
  language,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation(["movieDetails", "common"]);

  // Trailer (cached by movieId)
  const { videos, loading: videosLoading } = useMovieVideos(movieId);
  const [showModal, setShowModal] = useState(false);
  const trailer = videos[0];

  // Official site (cached by movieId)
  const { homepage, loading: homepageLoading } = useMovieHomepage(movieId);

  // Watch providers (cached by movieId + country)
  const {
    providers,
    streamingLink,
    loading: providersLoading,
  } = useWatchProviders(movieId, "US");

  // Movie certification (age rating + exact release date)
  const {
    certification,
    exactDate,
    loading: certLoading,
  } = useMovieCertification(movieId, "US");

  // Prepare tooltip text with translation
  const tooltipText = t("certification_tooltip", {
    certification: certification || "NR",
    date:
      exactDate ||
      new Date(releaseDate).toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      ),
  });

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
          {homepage && !homepageLoading && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-button"
            >
              <FiExternalLink /> {t("common:official_site")}
            </a>
          )}
          {trailer && !videosLoading && (
            <button
              className="trailer-button"
              onClick={() => setShowModal(true)}
              aria-label={t("watch_trailer_aria", "Watch trailer")}
            >
              <FiPlay /> {t("watch_trailer", "Watch Trailer")}
            </button>
          )}
        </div>

        <div className="hero-info">
          <div className="poster-wrapper">
            <motion.img
              src={posterUrl || "/fallback-poster.png"}
              alt={t("movieDetails:poster_alt", { title })}
              className="poster"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          </div>
          <div className="details">
            <h1>{title}</h1>
            {tagline && <p className="tagline">"{tagline}"</p>}
            <div className="meta">
              {/* Year */}
              <span className="meta-year">
                <FiCalendar /> {new Date(releaseDate).getFullYear()}
              </span>

              {/* Certification (only if exists) */}
              {certification && !certLoading && (
                <TooltipComponent title={tooltipText} position="top">
                  <div className="certification-badge">
                    <FiShield className="mt-0 mb-0" />
                    <div className="mt-0 mb-0">{certification}</div>
                  </div>
                </TooltipComponent>
              )}

              {/* Runtime */}
              <span className="meta-runtime">
                <FiClock /> {formatRuntime(runtime)}
              </span>

              {/* Rating */}
              <span className="meta-rating">
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
            <WatchProviders
              providers={providers}
              streamingLink={streamingLink}
              loading={providersLoading}
            />
          </div>
        </div>
      </div>

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
