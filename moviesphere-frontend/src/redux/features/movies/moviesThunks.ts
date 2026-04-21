import { createAsyncThunk } from "@reduxjs/toolkit";
import { moviesApi } from "../../../services/moviesApi";

// ================= TYPES =================
interface AIRecommendResponse {
  results: Array<{ title: string; year: number }>;
}

interface AIRecommendParams {
  title: string;
  year: number;
  genres: string;
  overview: string;
  language: string;
  limit?: number;
}

// ================= POPULAR =================
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopularMovies",
  async (
    { page, language }: { page: number; language: string },
    { rejectWithValue }
  ) => {
    try {
      return await moviesApi.getPopular(page, language);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= SEARCH =================
export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async (
    { query, language }: { query: string; language: string },
    { rejectWithValue }
  ) => {
    try {
      return await moviesApi.search(query, language);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= AI RECOMMENDATIONS =================
export const fetchAIRecommendations = createAsyncThunk<
  Array<{ title: string; year: number }>,
  AIRecommendParams,
  { rejectValue: string }
>(
  "movies/fetchAIRecommendations",
  async (
    { title, year, genres, overview },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          year,
          genres,
          overview,
          limit: 20,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI backend error: ${response.status}`);
      }

      const data: AIRecommendResponse = await response.json();

      // ✅ RETURN RAW AI DATA ONLY
      return data.results || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "AI fetch failed");
    }
  }
);