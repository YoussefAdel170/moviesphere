// src/hooks/useTvDetails.ts
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import type { TvShow } from "../../types/tvTypes";
import type { CastMember } from "../../types/castMemberType";
import { tvApi } from "../../services/tvApi";

export function useTvDetails(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [tv, setTv] = useState<TvShow | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const numericId = Number(id);

    Promise.all([
      tvApi.details(numericId, language),
      tvApi.similar(numericId, 1, language),
      tvApi.credits(numericId, language),
    ])
      .then(([tvData, similarData, creditsData]) => {
        if (isMounted) {
          setTv(tvData);
          setSimilar(similarData.results || []);
          setCast(creditsData.cast || []);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, language]);

  // Helper for runtime display (TV shows use episode/season count)
  const formatRuntime = () => {
    if (!tv) return "";
    return `${tv.number_of_episodes} episodes • ${tv.number_of_seasons} seasons`;
  };

  // TV shows don't have budget/revenue, so return N/A
  const formatCurrency = () => "N/A";

  const posterUrl = tv?.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : null;

  const backdropUrl = tv?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
    : null;

  return {
    tv,
    similar,
    cast,
    loading,
    error,
    posterUrl,
    backdropUrl,
    formatCurrency,
    formatRuntime,
  };
}
