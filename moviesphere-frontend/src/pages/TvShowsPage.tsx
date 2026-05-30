// src/pages/TvShowsPage.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTvShowsPage } from "../hooks/tv/useTvShowsPage";
import Pagination from "../components/ui/pagination/Pagination";
import MoviesList from "../components/ui/MovieList";
import EmptyMoviesState from "../components/ui/emptyMoviesState/EmptyMoviesState";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import ErrorPage from "./ErrorPage";
import TvFilters from "../components/ui/filters/TvFilters";

export default function TvShowsPage() {
  const { t } = useTranslation("tv");

  const {
    shows,
    loading,
    error,
    pages,
    query,
    page,
    handlePageChange,
    clearSearch,
  } = useTvShowsPage();

  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorPage message={error} />;
  if (!shows || shows.length === 0)
    return <EmptyMoviesState onClearSearch={clearSearch} />;

  const normalizedShows = shows.map((show) => ({
    ...show,
    title: show.name,
  }));

  return (
    <div className="tv-shows-page mt-20" id="main-content">
      {query && (
        <h2
          className="text-center text-xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("common.search_results", { query })}
        </h2>
      )}

      <div className="flex px-6">
        <TvFilters />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={query + page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MoviesList movies={normalizedShows} mediaType="tv" />
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
