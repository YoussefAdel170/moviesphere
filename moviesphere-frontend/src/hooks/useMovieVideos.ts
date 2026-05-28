// src/hooks/useMovieVideos.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";

export type Provider = {
  logo_path: string;
  provider_name: string;
  provider_id: number;
  display_priority: number;
};

type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

// Cache by movieId only (trailers are language‑independent)
const videosCache = new Map<number, Video[]>();

export function useMovieVideos(movieId: number | undefined) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    // Check cache by movieId only
    if (videosCache.has(movieId)) {
      setVideos(videosCache.get(movieId)!);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    // Fetch once – language doesn't matter for trailer keys
    moviesApi
      .videos(movieId, "en-US") // use any language; result is same across languages
      .then((data) => {
        if (isMounted) {
          const trailers = data.results?.filter(
            (v: Video) => v.site === "YouTube" && v.type === "Trailer",
          );
          const best =
            trailers?.find((t: Video) => t.official) || trailers?.[0];
          const result = best ? [best] : [];
          videosCache.set(movieId, result);
          setVideos(result);
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

  return { videos, loading, error };
}
