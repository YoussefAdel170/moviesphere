import { useEffect, useState } from "react";
import { tvApi } from "../../services/tvApi";

export type Provider = {
  logo_path: string;
  provider_name: string;
  provider_id: number;
  display_priority: number;
};

export function useTvWatchProviders(tvId: number, userCountry: string = "US") {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [streamingLink, setStreamingLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!tvId) return;
    let isMounted = true;
    setLoading(true);
    tvApi
      .watchProviders(tvId)
      .then((data: any) => {
        if (!isMounted) return;
        const countryData = data.results?.[userCountry];
        if (!countryData) {
          setProviders([]);
          setStreamingLink("");
          return;
        }
        const flatrate = countryData.flatrate || [];
        const sorted = [...flatrate].sort(
          (a, b) => a.display_priority - b.display_priority,
        );
        setProviders(sorted);
        setStreamingLink(countryData.link || "");
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => {
      isMounted = false;
    };
  }, [tvId, userCountry]);

  return { providers, streamingLink, loading, error };
}
