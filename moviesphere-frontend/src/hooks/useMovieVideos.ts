// src/hooks/useMovieVideos.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";

type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export function useMovieVideos(movieId: number | undefined, language: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    let isMounted = true;
    setLoading(true);

    moviesApi
      .videos(movieId, language)
      .then((data) => {
        if (isMounted) {
          // Find the best trailer: official YouTube trailer, or any trailer
          const trailers = data.results?.filter(
            (v: Video) => v.site === "YouTube" && v.type === "Trailer",
          );
          const best =
            trailers?.find((t: Video) => t.official) || trailers?.[0];
          setVideos(best ? [best] : []);
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
  }, [movieId, language]);

  return { videos, loading, error };
}
