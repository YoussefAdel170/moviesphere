// src/hooks/useCastPage.ts
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { moviesApi } from "../services/moviesApi";
import type { CastMember } from "../types/castMemberType";

export function useCastPage(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    Promise.all([
      moviesApi.details(Number(id), language),
      moviesApi.credits(Number(id), language),
    ])
      .then(([movie, credits]) => {
        if (isMounted) {
          setMovieTitle(movie.title);
          setCast(credits.cast || []);
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

  return { cast, loading, error, movieTitle };
}
