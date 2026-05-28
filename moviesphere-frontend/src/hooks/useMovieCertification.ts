// src/hooks/useMovieCertification.ts
import { useEffect, useState } from "react";
import { moviesApi } from "../services/moviesApi";
import { useAppSelector } from "../redux/hooks";

type ReleaseDate = {
  certification: string;
  iso_639_1: string;
  release_date: string;
  type: number;
};

type CountryRelease = {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
};

export function useMovieCertification(
  movieId: number,
  userCountry: string = "US",
) {
  const { language } = useAppSelector((state) => state.movies);
  const [certification, setCertification] = useState<string | null>(null);
  const [exactDate, setExactDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    let isMounted = true;
    setLoading(true);

    moviesApi
      .releaseDates(movieId)
      .then((data: { results: CountryRelease[] }) => {
        if (!isMounted) return;
        const countryData = data.results.find(
          (c) => c.iso_3166_1 === userCountry,
        );
        if (countryData && countryData.release_dates.length) {
          const theatrical = countryData.release_dates.find(
            (rd) => rd.type === 3,
          );
          const release = theatrical || countryData.release_dates[0];
          setCertification(release.certification || "NR");
          setExactDate(release.release_date); // ISO string YYYY-MM-DD
        } else {
          setCertification(null);
          setExactDate(null);
        }
      })
      .catch(() => {
        if (isMounted) setCertification(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movieId, userCountry]);

  // Format date as "1 May 2016" or localised
  const formatReleaseDate = (isoDate: string | null) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formattedDate = exactDate ? formatReleaseDate(exactDate) : null;

  return { certification, exactDate: formattedDate, loading };
}
