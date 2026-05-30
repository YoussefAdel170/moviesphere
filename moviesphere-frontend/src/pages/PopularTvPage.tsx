// src/pages/PopularTvPage.tsx
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FiTv } from "react-icons/fi";
import { tvApi } from "../services/tvApi";
import MediaListPage from "./generic/MediaListPage";
import MovieCard from "../components/ui/moviecard/MovieCard";
import { normalizeMovie } from "../utils/normalizeMovie";

export default function PopularTvPage() {
  const { t } = useTranslation("tv");
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    tvApi
      .popular(page, "en-US")
      .then((data) => {
        setShows(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch(() => setError(true));
  }, [page]);

  const renderCard = (show: any, index: number) => {
    const normalized = normalizeMovie(show);
    return (
      <MovieCard
        key={normalized.id}
        id={normalized.id}
        title={normalized.title}
        poster_path={normalized.poster_path}
        vote_average={normalized.vote_average}
        overview={normalized.overview}
        genre_ids={normalized.genre_ids}
        index={index}
        mediaType="tv"
      />
    );
  };

  return (
    <MediaListPage
      items={shows}
      loading={loading}
      error={error}
      emptyStateConfig={{
        icon: <FiTv />,
        title: t("popular.no_shows", "No TV shows found"),
        message: t(
          "popular.no_shows_message",
          "Try adjusting your filters or check back later.",
        ),
      }}
      backLinkTo="/"
      backLinkText={t("popular.back_home", "Back to Home")}
      title={t("popular.title", "Popular TV Shows")}
      renderItem={renderCard}
      pagination={{
        currentPage: page,
        totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
