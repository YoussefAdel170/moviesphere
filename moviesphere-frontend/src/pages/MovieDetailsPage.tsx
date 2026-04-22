// src/pages/MovieDetailsPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FiArrowLeft, FiClock, FiCalendar, FiStar, 
  FiDollarSign, FiFilm, FiGlobe, FiHome, FiExternalLink 
} from 'react-icons/fi';
import MovieCard from '../components/ui/moviecard/MovieCard';
import AIRecommendations from '../components/ui/aiRecommendations/AIRecommendations';
import { useMovieDetails } from '../hooks/useMovieDetailsPage';
import './MovieDetailsPage.scss';
import { normalizeMovie } from '../utils/normalizeMovie';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['movieDetails', 'common']);
  const { movie, similar, loading, error, posterUrl, backdropUrl, formatCurrency, formatRuntime } = useMovieDetails(id);

  if (loading) return <div className="details-skeleton">{t('common:loading')}</div>;
  if (error || !movie) return <div className="details-error">{t('common:not_found')}</div>;

  // Convert id to number for the AI component
  const movieIdNumber = Number(id);

  return (
    <motion.div
      className="movie-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section with Backdrop */}
      <div className="hero-section" style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none' }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="action-buttons lg:mt-5 md:mt-5 mt-2">
            <button className="back-button" onClick={() => navigate(-1)} aria-label={t('common:back_aria')}>
              <FiArrowLeft /> {t('common:back_button')}
            </button>
            <Link to="/" className="home-button" aria-label={t('common:home_aria')}>
              <FiHome /> {t('common:home_button')}
            </Link>
            {movie.homepage && (
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="homepage-button">
                <FiExternalLink /> {t('common:official_site')}
              </a>
            )}
          </div>
          <div className="hero-info">
            <motion.img
              src={posterUrl || '/fallback-poster.png'}
              alt={t('movieDetails:poster_alt', { title: movie.title })}
              className="poster mt-25"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <div className="details">
              <h1>{movie.title}</h1>
              {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
              <div className="meta">
                <span><FiCalendar /> {new Date(movie.release_date).getFullYear()}</span>
                <span><FiClock /> {formatRuntime(movie.runtime)}</span>
                <span><FiStar /> {movie.vote_average.toFixed(1)} ({t('movieDetails:votes', { count: movie.vote_count })})</span>
              </div>
              <div className="genres">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre-badge">{genre.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="overview">
          <h2>{t('movieDetails:overview')}</h2>
          <p>{movie.overview}</p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FiDollarSign />
            <h3>{t('movieDetails:budget')}</h3>
            <p>{formatCurrency(movie.budget)}</p>
          </div>
          <div className="info-card">
            <FiDollarSign />
            <h3>{t('movieDetails:revenue')}</h3>
            <p>{formatCurrency(movie.revenue)}</p>
          </div>
          <div className="info-card">
            <FiGlobe />
            <h3>{t('movieDetails:original_language')}</h3>
            <p>{movie.original_language.toUpperCase()}</p>
          </div>
          <div className="info-card">
            <FiFilm />
            <h3>{t('movieDetails:status')}</h3>
            <p>{movie.status}</p>
          </div>
        </div>

        {movie.production_companies.length > 0 && (
          <div className="production">
            <h2>{t('movieDetails:production_companies')}</h2>
            <div className="companies">
              {movie.production_companies.map(company => (
                <div key={company.id} className="company">
                  {company.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="company-fallback">{company.name}</div>
                  )}
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        {similar.length > 0 && (
          <div className="similar-movies">
            <div className="similar-header">
              <h2>{t('movieDetails:tmdb_recommends')}</h2>
              <Link to={`/movie/${id}/similar`} className="view-more-link">
                {t('common:view_all')}
              </Link>
            </div>
            <div className="similar-grid">
              {similar.map((movie, idx) => {
                const normalized = normalizeMovie(movie);
                return (
                  <MovieCard
                    key={normalized.id}
                    id={normalized.id}
                    title={normalized.title}
                    poster_path={normalized.poster_path || undefined}
                    vote_average={normalized.vote_average}
                    index={idx}
                    overview={normalized.overview}
                    genre_ids={normalized.genre_ids}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* AI Recommendations - Pass correct types */}
        {movie && (
          <AIRecommendations
            movieId={movieIdNumber}
            movieTitle={movie.title}
            movieYear={new Date(movie.release_date).getFullYear()}
            movieGenres={movie.genres.map(g => g.name).join(", ")}
            movieOverview={movie.overview}
          />
        )}
      </div>
    </motion.div>
  );
}