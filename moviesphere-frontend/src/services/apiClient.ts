// src/services/apiClient.ts
export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("Missing VITE_API_KEY environment variable");
}

const buildUrl = (endpoint: string) => {
  const hasQuery = endpoint.includes("?");
  return `${BASE_URL}${endpoint}${hasQuery ? "&" : "?"}api_key=${API_KEY}`;
};

export const apiClient = async (endpoint: string) => {
  try {
    const res = await fetch(buildUrl(endpoint));
    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new ApiError(
        data.status_message || "API Error",
        data.status_code || res.status,
      );
    }

    return data;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error. Please try again.");
  }
};
