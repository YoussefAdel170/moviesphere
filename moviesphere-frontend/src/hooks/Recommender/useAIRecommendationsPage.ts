// src/hooks/useAIRecommendationsPage.ts
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { moviesApi } from "../../services/moviesApi";

export function useAIRecommendationsPage(id: string | undefined) {
  const { language } = useAppSelector((state) => state.movies);
  const [searchParams, setSearchParams] = useSearchParams();
  const [movieTitle, setMovieTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState({
    results: [] as any[],
    total_pages: 0,
    page: 1,
    total_results: 0,
  });

  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 20;

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Get movie details (for title, year, etc.)
        const movie = await moviesApi.details(Number(id), language);
        if (!isMounted) return;
        setMovieTitle(movie.title);

        const year = new Date(movie.release_date).getFullYear();
        const genres = movie.genres.map((g: any) => g.name).join(", ");
        const overview = movie.overview;

        // 2. Call AI backend directly (no Redux thunk – simpler for pagination)
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const aiResponse = await fetch(`${baseUrl}/api/ai-recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            year,
            genres,
            language,
            overview,
            page: 1,
            limit: 100, // ask for up to 100 AI suggestions
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(`AI backend error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();

        if (!aiData.results?.length) {
          setRecommendations({
            results: [],
            total_pages: 0,
            page: 1,
            total_results: 0,
          });
          return;
        }

        // 3. Enrich each AI suggestion with TMDB data
        const moviesWithDetails = await Promise.all(
          aiData.results.map(async (rec: any) => {
            const searchRes = await moviesApi.search(rec.title, language);
            const found =
              searchRes.results?.find(
                (m: any) => new Date(m.release_date).getFullYear() === rec.year,
              ) || searchRes.results?.[0];
            return found;
          }),
        );

        // 4. Filter nulls and deduplicate by ID
        const validMovies = moviesWithDetails.filter(Boolean);
        const unique = Array.from(
          new Map(validMovies.map((m: any) => [m.id, m])).values(),
        );

        // 5. Paginate
        const start = (page - 1) * itemsPerPage;
        const paginatedResults = unique.slice(start, start + itemsPerPage);

        if (isMounted) {
          setRecommendations({
            results: paginatedResults,
            total_pages: Math.ceil(unique.length / itemsPerPage),
            page: page,
            total_results: unique.length,
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load recommendations");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, language, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    movieTitle,
    recommendations,
    loading,
    error,
    handlePageChange,
    page,
  };
}
