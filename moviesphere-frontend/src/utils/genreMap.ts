import type { TFunction } from "i18next";

export const genreTranslationKeys: Record<number, string> = {
  28: "genre.action",
  12: "genre.adventure",
  16: "genre.animation",
  35: "genre.comedy",
  80: "genre.crime",
  99: "genre.documentary",
  18: "genre.drama",
  10751: "genre.family",
  14: "genre.fantasy",
  36: "genre.history",
  27: "genre.horror",
  10402: "genre.music",
  9648: "genre.mystery",
  10749: "genre.romance",
  878: "genre.sciFi",
  10770: "genre.tvMovie",
  53: "genre.thriller",
  10752: "genre.war",
  37: "genre.western",
};

export function getGenreNames(genreIds: number[], t: TFunction): string[] {
  if (!genreIds || !Array.isArray(genreIds)) return [];
  return genreIds
    .map((id) => {
      const key = genreTranslationKeys[id];
      return key ? t(key) : null;
    })
    .filter((name): name is string => name !== null)
    .slice(0, 4);
}
