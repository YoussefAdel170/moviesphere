// src/types/tvTypes.ts

export type TvGenre = {
  id: number;
  name: string;
};

export type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

export type Season = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
};

export type Episode = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  runtime: number;
  air_date: string;
};

export type TvShow = {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  tagline: string;
  genres: TvGenre[];
  production_companies: ProductionCompany[];
  status: string;
  original_language: string;
  homepage: string | null;
  seasons: Season[];
};
