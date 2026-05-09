import { useEffect, useMemo, useState } from "react";
import { moviesApi } from "../../services/moviesApi";
import { useAppSelector } from "../../redux/hooks";

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
}: UseAIRecommendationsParams) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (!title || !year) return;

    let isCancelled = false;

    const fetchAI = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const url = `${baseUrl}/api/ai-recommend`;

        const aiResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            year,
            genres,
            language,
            overview,
            page: 1,
            limit: 20,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(`AI backend error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();

        // Robust array extraction
        let results: any[] = [];
        if (Array.isArray(aiData.results)) {
          results = aiData.results;
        } else if (Array.isArray(aiData)) {
          results = aiData;
        } else if (Array.isArray(aiData.recommendations)) {
          results = aiData.recommendations;
        } else if (Array.isArray(aiData.movies)) {
          results = aiData.movies;
        }

        if (results.length === 0) {
          setRecommendations([]);
          return;
        }

        const movies = await Promise.all(
          results.map(async (rec: any) => {
            const searchRes = await moviesApi.search(rec.title, language);
            const found =
              searchRes.results?.find(
                (m: any) => new Date(m.release_date).getFullYear() === rec.year,
              ) || searchRes.results?.[0];
            return found;
          }),
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

  // Safe deduplication
  const uniqueRecommendations = useMemo(() => {
    if (!Array.isArray(recommendations)) return [];
    const map = new Map();
    recommendations.forEach((m) => {
      if (m && m.id) map.set(m.id, m);
    });
    return Array.from(map.values());
  }, [recommendations]);

  return {
    recommendations: uniqueRecommendations,
    loading,
    error,
  };
}
