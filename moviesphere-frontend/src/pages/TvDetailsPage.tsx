// src/pages/TvDetailsPage.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiCalendar,
  FiStar,
  FiHome,
  FiExternalLink,
  FiTv,
  FiGlobe,
  FiFilm,
  FiClock,
} from "react-icons/fi";
import { useTvDetails } from "../hooks/tv/useTvDetails";
import { useTvReviews } from "../hooks/tv/useTvReviews";
import { useTvWatchProviders } from "../hooks/tv/useTvWatchProviders";
import CastCarousel from "../components/ui/castCarousel/CastCarousel";
import SeasonsCarousel from "../components/ui/seasonsCarousel/SeasonsCarousel";
import ReviewsSection from "../components/ui/reviewsSection/ReviewSection";
import WatchProviders from "../components/ui/watchProviders/WatchProviders";
import "./TvDetailsPage.scss";
import SimilarCarousel from "../components/ui/utilities/SimilarCarousel";

export default function TvDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["tvDetails", "common"]);
  const tvId = Number(id);

  const {
    tv,
    similar,
    cast,
    loading,
    error,
    posterUrl,
    backdropUrl,
    formatRuntime,
  } = useTvDetails(id);
  const { reviews, loading: reviewsLoading } = useTvReviews(tvId, 1);
  const {
    providers,
    streamingLink,
    loading: providersLoading,
  } = useTvWatchProviders(tvId, "US");

  if (loading)
    return <div className="details-skeleton">{t("common:loading")}</div>;
  if (error || !tv)
    return <div className="details-error">{t("common:not_found")}</div>;

  console.log(reviews);

  return (
    <motion.div
      className="tv-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="action-buttons">
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
            {tv.homepage && (
              <a
                href={tv.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="homepage-button"
              >
                <FiExternalLink /> {t("common:official_site")}
              </a>
            )}
          </div>

          <div className="hero-info">
            <div className="poster-wrapper">
              <img
                src={posterUrl || "/fallback-poster.png"}
                alt={tv.name}
                className="poster"
              />
              <WatchProviders
                providers={providers}
                streamingLink={streamingLink}
                loading={providersLoading}
              />
            </div>
            <div className="details">
              <h1>{tv.name}</h1>
              {tv.tagline && <p className="tagline">"{tv.tagline}"</p>}
              <div className="meta">
                <span>
                  <FiCalendar /> {new Date(tv.first_air_date).getFullYear()}
                </span>
                <span>
                  <FiTv /> {formatRuntime()}
                </span>
                <span>
                  <FiStar /> {tv.vote_average.toFixed(1)} (
                  {t("tv:details.votes", { count: tv.vote_count })})
                </span>
              </div>
              <div className="genres">
                {tv.genres.map((genre) => (
                  <span key={genre.id} className="genre-badge">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {/* Overview */}
        <div className="overview">
          <h2>{t("tv:details.overview")}</h2>
          <p>{tv.overview}</p>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          <div className="info-card">
            <FiGlobe />
            <h3>{t("tv:details.original_language")}</h3>
            <p>{tv.original_language.toUpperCase()}</p>
          </div>
          <div className="info-card">
            <FiFilm />
            <h3>{t("tv:details.status")}</h3>
            <p>{tv.status}</p>
          </div>
          <div className="info-card">
            <FiCalendar />
            <h3>{t("tv:details.first_air_date")}</h3>
            <p>{new Date(tv.first_air_date).getFullYear()}</p>
          </div>
          <div className="info-card">
            <FiClock />
            <h3>{t("tv:details.episodes")}</h3>
            <p>{tv.number_of_episodes}</p>
          </div>
        </div>

        {/* Production Companies */}
        {tv.production_companies.length > 0 && (
          <div className="production">
            <h2>{t("tv:details.production_companies")}</h2>
            <div className="companies">
              {tv.production_companies.map((company) => (
                <div key={company.id} className="company">
                  {company.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                    />
                  ) : (
                    <div className="company-fallback">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasons Carousel */}
        <SeasonsCarousel seasons={tv.seasons} tvId={tvId} />

        {/* Cast Carousel */}
        {cast.length > 0 && <CastCarousel cast={cast} movieId={tvId} />}

        {/* Similar TV Shows */}
        {similar.length > 0 && (
          <SimilarCarousel
            items={similar}
            id={tvId}
            mediaType="tv"
            titleKey="tv:details.tmdb_recommends"
          />
        )}

        {/* Reviews Section */}
        {!reviewsLoading && reviews.length > 0 && (
          <ReviewsSection
            reviews={reviews}
            loading={reviewsLoading}
            id={tvId}
            mediaType="tv"
          />
        )}
      </div>
    </motion.div>
  );
}
