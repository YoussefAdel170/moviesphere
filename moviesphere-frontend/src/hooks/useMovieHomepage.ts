// src/hooks/useMovieHomepage.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";

const homepageCache = new Map<number, string | null>();

export function useMovieHomepage(movieId: number | undefined) {
  const [homepage, setHomepage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    if (homepageCache.has(movieId)) {
      setHomepage(homepageCache.get(movieId)!);
      return;
    }

    let isMounted = true;
    setLoading(true);

    moviesApi
      .details(movieId, "en-US") // language‑independent
      .then((data) => {
        if (isMounted) {
          const url = data.homepage || null;
          homepageCache.set(movieId, url);
          setHomepage(url);
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
  }, [movieId]);

  return { homepage, loading, error };
}
