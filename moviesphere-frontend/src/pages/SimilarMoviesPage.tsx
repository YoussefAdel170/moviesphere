// src/pages/SimilarMoviesPage.tsx
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft } from 'react-icons/fi';

import MovieCard from '../components/ui/moviecard/MovieCard';
import Pagination from '../components/ui/pagination/Pagination';
import SkeletonGrid from '../components/ui/SkeletonGrid';

import { useSimilarMoviesPage } from '../hooks/useSimilarMoviesPage';
import './SimilarMoviesPage.scss';
import { normalizeMovie } from '../utils/normalizeMovie';

export default function SimilarMoviesPage() {
  const { id } = useParams();
  const { t } = useTranslation('similarMoviesPage');

  const {
    movies,
    totalPages,
    loading,
    error,
    movieTitle,
    page,
    handlePageChange,
  } = useSimilarMoviesPage(id);

  const isEmpty = !loading && !error && movies.length === 0;
  const hasMovies = !loading && !error && movies.length > 0;

  return (
    <motion.div
      className="similar-movies-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        {/* HEADER */}
        <div className="header">
          <Link to={`/movie/${id}`} className="back-link">
            <FiArrowLeft /> {t('back_link', { title: movieTitle || t('movie') })}
          </Link>
          <h1>{t('page_title', { title: movieTitle })}</h1>
        </div>

        {/* CONTENT WRAPPER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${page}-${loading ? 'loading' : error ? 'error' : 'data'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* LOADING */}
            {loading && <SkeletonGrid />}

            {/* ERROR */}
            {!loading && error && (
              <div className="similar-error">{t('error')}</div>
            )}

            {/* EMPTY */}
            {isEmpty && (
              <p className="no-results">{t('no_results')}</p>
            )}

            {/* CONTENT */}
            {hasMovies && (
              <>
                <div className="similar-grid">
                  {movies.map((movie, idx) => {
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

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}