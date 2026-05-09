// src/pages/MoviesPage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useMoviesPage } from "../hooks/useMoviesPage";
import Pagination from "../components/ui/pagination/Pagination";
import MoviesList from "../components/ui/MovieList";
import EmptyMoviesState from "../components/ui/emptyMoviesState/EmptyMoviesState";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import ErrorPage from "./ErrorPage";
import MovieFilters from "../components/ui/filters/MovieFilters";

export default function MoviesPage() {
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

  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorPage message={error} />;
  if (!movies || movies.length === 0)
    return <EmptyMoviesState onClearSearch={clearSearch} />;

  return (
    <div className="movies-page mt-20" id="main-content">
      {query && (
        <h2
          className="text-center text-xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Search results for: <span className="font-bold">{query}</span>
        </h2>
      )}

      {/* Filter button – opens popover with all controls */}
      <div className="flex px-6">
        <MovieFilters />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={query + page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MoviesList movies={movies} />
        </motion.div>
      </AnimatePresence>

      {pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
