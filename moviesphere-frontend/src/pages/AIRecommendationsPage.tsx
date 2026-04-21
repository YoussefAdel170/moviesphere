import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft } from 'react-icons/fi';

import MovieCard from '../components/ui/moviecard/MovieCard';
import Pagination from '../components/ui/pagination/Pagination';

import './AIRecommendationsPage.scss';
import { useAIRecommendationsPage } from '../hooks/Recommender/useAIRecommendationsPage';
import SkeletonGrid from '../components/ui/SkeletonGrid';
import { normalizeMovie } from '../utils/normalizeMovie';

export default function AIRecommendationsPage() {
  const { id } = useParams();
  const { t } = useTranslation('aiRecommendations');

  const {
    recommendations,
    loading,
    error,
    movieTitle,
    page,
    handlePageChange,
  } = useAIRecommendationsPage(id);

  // 🔄 Loading (ENHANCED - skeleton instead of text)
  if (loading) {
    return (
      <motion.div
        className="similar-movies-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <SkeletonGrid />
        </div>
      </motion.div>
    );
  }

  // ❌ Error (ENHANCED - better UX)
  if (error) {
    return (
      <motion.div
        className="similar-movies-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <div className="text-center py-10">
            <p className="text-red-500 font-semibold">
              {t('error')}
            </p>

            <Link
              to={`/movie/${id}`}
              className="mt-4 inline-flex items-center gap-2 text-accent-primary"
            >
              <FiArrowLeft />
              {t('back_link', { title: movieTitle || t('movie') })}
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="similar-movies-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">

        {/* HEADER (UNCHANGED) */}
        <div className="header">
          <Link to={`/movie/${id}`} className="back-link">
            <FiArrowLeft /> {t('back_link', { title: movieTitle || t('movie') })}
          </Link>

          <h1>
            {t('page_title', { title: movieTitle })}
          </h1>
        </div>

        {/* EMPTY STATE (same logic, slightly safer) */}
        {recommendations.results.length === 0 ? (
          <p className="no-results">{t('no_results')}</p>
        ) : (
          <>
            {/* GRID (UNCHANGED) */}
            <div className="similar-grid">
              {recommendations.results.map((movie, idx) => {
                const normalized = normalizeMovie(movie);

                return (
                  <MovieCard
                    key={normalized.id}
                    id={normalized.id}
                    title={normalized.title}
                    poster_path={normalized.poster_path}
                    vote_average={normalized.vote_average}
                    overview={normalized.overview}
                    genre_ids={normalized.genre_ids}
                    index={idx}
                  />
                );
              })}
            </div>

            {/* PAGINATION (UNCHANGED) */}
            {recommendations.total_pages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={recommendations.total_pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

      </div>
    </motion.div>
  );
}