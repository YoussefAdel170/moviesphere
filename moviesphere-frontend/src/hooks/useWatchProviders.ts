// src/hooks/useWatchProviders.ts
import { useEffect, useState, useRef } from "react";

export type Provider = {
  logo_path: string;
  provider_name: string;
  provider_id: number;
  display_priority: number;
};

type WatchProvidersResponse = {
  id: number;
  results: {
    [country: string]: {
      link: string;
      flatrate?: Provider[];
      rent?: Provider[];
      buy?: Provider[];
      ads?: Provider[];
    };
  };
};

const providerCache = new Map<
  string,
  { providers: Provider[]; link: string }
>();

export function useWatchProviders(movieId: number, userCountry: string = "US") {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [streamingLink, setStreamingLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKey = `${movieId}-${userCountry}`;

  useEffect(() => {
    if (!movieId) return;

    if (providerCache.has(cacheKey)) {
      const cached = providerCache.get(cacheKey)!;
      setProviders(cached.providers);
      setStreamingLink(cached.link);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    import("../services/moviesApi").then(({ moviesApi }) => {
      moviesApi
        .watchProviders(movieId)
        .then((data: WatchProvidersResponse) => {
          if (!isMounted) return;
          let countryData = data.results?.[userCountry];
          if (!countryData && userCountry !== "US") {
            countryData = data.results?.US;
          }
          if (!countryData) {
            const firstKey = Object.keys(data.results || {})[0];
            countryData = data.results?.[firstKey];
          }
          const flatrate = countryData?.flatrate || [];
          const sorted = [...flatrate].sort(
            (a, b) => a.display_priority - b.display_priority,
          );
          const link = countryData?.link || "";
          providerCache.set(cacheKey, { providers: sorted, link });
          setProviders(sorted);
          setStreamingLink(link);
        })
        .catch((err) => {
          if (isMounted && err.name !== "AbortError") {
            setError(true);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    });

    return () => {
      isMounted = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [movieId, userCountry, cacheKey]);

  return { providers, streamingLink, loading, error };
}
