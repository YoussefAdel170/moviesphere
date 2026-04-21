export function normalizeMovie(movie: any) {
  return {
    id: movie.id,
    title: movie.title || movie.name || "Unknown",
    poster_path: movie.poster_path || null,
    vote_average: movie.vote_average || 0,
    overview: movie.overview || "No description available",
    genre_ids:
      movie.genre_ids ||
      movie.genres?.map((g: any) => g.id) ||
      [],
  };
}