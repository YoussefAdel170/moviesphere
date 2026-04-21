// src/pages/MoviesPage.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import Pagination from '../components/ui/pagination/Pagination';
import MoviesList from '../components/ui/MovieList';
import EmptyMoviesState from '../components/ui/emptyMoviesState/EmptyMoviesState';
import SkeletonGrid from '../components/ui/SkeletonGrid';
import ErrorPage from './ErrorPage';
import { useMoviesPage } from '../hooks/useMoviesPage';

export default function MoviesPage() {
  const { t } = useTranslation('common');

  const {
    movies,
    loading,
    error,
    pages,
    query,
    page,
    handlePageChange,
    clearSearch,
  } = useMoviesPage();

  // UX improvement: scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const isEmpty = !loading && !error && (!movies || movies.length === 0);
  const hasMovies = !loading && !error && movies && movies.length > 0;

  if (!movies.length) {
    return (
      <EmptyMoviesState onClearSearch={clearSearch} />
    );
  }


  return (
    <div className="movies-page mt-25" id="main-content">
      {query && (
        <h2
          className="text-center text-xl mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('search_results', { query })}
        </h2>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${query ?? 'all'}-${page}-${loading ? 'loading' : error ? 'error' : 'data'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* LOADING */}
          {loading && <SkeletonGrid />}

          {/* ERROR */}
          {!loading && error && <ErrorPage message={error} />}

          {/* EMPTY STATE */}
          {isEmpty && (
            <EmptyMoviesState onClearSearch={clearSearch} />
          )}

          {/* CONTENT */}
          {hasMovies && (
            <>
              <MoviesList movies={movies} />

              {pages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}