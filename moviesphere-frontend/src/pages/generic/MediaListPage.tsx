// src/components/ui/MediaListPage/MediaListPage.tsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

import "./MediaListPage.scss";
import type { ReactNode } from "react";
import SkeletonGrid from "../../components/ui/SkeletonGrid";
import ErrorPage from "../ErrorPage";
import EmptyState from "../../components/ui/utilities/EmptyState";
import Pagination from "../../components/ui/pagination/Pagination";

export type MediaListPageProps<T> = {
  // Data
  items: T[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;

  // Empty state
  emptyStateConfig: {
    icon?: ReactNode;
    title: string;
    message: string;
    buttonText?: string;
    onButtonClick?: () => void;
  };

  // Header
  backLinkTo: string;
  backLinkText: string;
  title: string;

  // Render function
  renderItem: (item: T, index: number) => ReactNode;

  // Pagination (optional)
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };

  // Optional custom grid class
  gridClassName?: string;
};

export default function MediaListPage<T>({
  items,
  loading,
  error,
  errorMessage = "Something went wrong",
  emptyStateConfig,
  backLinkTo,
  backLinkText,
  title,
  renderItem,
  pagination,
  gridClassName = "media-grid",
}: MediaListPageProps<T>) {
  const isEmpty = !loading && !error && items.length === 0;

  if (loading) return <SkeletonGrid />;

  if (error) return <ErrorPage message={errorMessage} />;

  if (isEmpty) return <EmptyState {...emptyStateConfig} />;

  return (
    <motion.div
      className="media-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        {/* Header */}
        <div className="header">
          <Link to={backLinkTo} className="back-link">
            <FiArrowLeft /> {backLinkText}
          </Link>
          <h1>{title}</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={items.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={gridClassName}>
              {items.map((item, idx) => renderItem(item, idx))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
