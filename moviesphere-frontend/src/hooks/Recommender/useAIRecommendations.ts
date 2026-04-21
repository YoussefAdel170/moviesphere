import { useEffect, useMemo, useState } from "react";
import { moviesApi } from "../../services/moviesApi";

interface UseAIRecommendationsParams {
  title: string;
  year: number;
  genres: string;
  overview: string;
  language?: string;
}

export function useAIRecommendations({
  title,
  year,
  genres,
  overview,
  language = "en-US",
}: UseAIRecommendationsParams) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!title || !year) return;

    let isCancelled = false;

    const fetchAI = async () => {
      try {
        setLoading(true);
        setError(null);

        const aiResponse = await fetch("/api/ai-recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            year,
            genres,
            overview,
            page: 1,
            limit: 20,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(`AI backend error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();

        if (!aiData.results?.length) {
          setRecommendations([]);
          return;
        }

        const movies = await Promise.all(
          aiData.results.map(async (rec: any) => {
            const searchRes = await moviesApi.search(rec.title, language);

            const found =
              searchRes.results?.find(
                (m: any) =>
                  new Date(m.release_date).getFullYear() === rec.year
              ) || searchRes.results?.[0];

            return found;
          })
        );

        if (!isCancelled) {
          setRecommendations(movies.filter(Boolean));
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to fetch AI recommendations");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAI();

    return () => {
      isCancelled = true;
    };
  }, [title, year, genres, overview, language]);

  // remove duplicates safely
  const uniqueRecommendations = useMemo(() => {
    return Array.from(
      new Map(recommendations.map((m) => [m.id, m])).values()
    );
  }, [recommendations]);

  return {
    recommendations: uniqueRecommendations,
    loading,
    error,
  };
}