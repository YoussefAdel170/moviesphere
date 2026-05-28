// src/components/ui/movieCarousel/MovieCarousel.tsx
import type { ReactNode } from "react";
import MovieCard from "../moviecard/MovieCard";
import { normalizeMovie } from "../../../utils/normalizeMovie";
import HorizontalCarousel from "../horizontalCarousel/HorizontalCarousel";
import SkeletonGrid from "../SkeletonGrid";
import "./MovieCarousel.scss";

type Movie = {
  id: number;
  title?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
};

type Props = {
  items: Movie[];
  loading?: boolean;
  error?: boolean;
  title: string;
  viewAllLink: {
    to: string;
    label: string;
    icon?: ReactNode;
  } | null;
  emptyMessage?: string;
  itemWidth?: number;
  gap?: number;
};

export default function MovieCarousel({
  items,
  loading = false,
  error = false,
  title,
  viewAllLink,
  itemWidth = 180,
  gap = 24,
}: Props) {
  if (loading) {
    return (
      <div className="movie-carousel-loading">
        <div className="carousel-header-placeholder">
          <h2>{title}</h2>
        </div>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (error || items.length === 0) {
    return null;
  }

  const renderMovieCard = (movie: Movie) => {
    const normalized = normalizeMovie(movie);
    return (
      <MovieCard
        id={normalized.id}
        title={normalized.title}
        poster_path={normalized.poster_path}
        vote_average={normalized.vote_average}
        overview={normalized.overview}
        genre_ids={normalized.genre_ids}
      />
    );
  };

  const visibleItems = items.slice(0, 10);

  return (
    <HorizontalCarousel
      title={title}
      viewAllLink={viewAllLink || undefined}
      items={visibleItems}
      renderItem={renderMovieCard}
      itemWidth={itemWidth}
      gap={gap}
    />
  );
}
