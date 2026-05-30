import { useTranslation } from "react-i18next";
import { FiFilm } from "react-icons/fi";
import MovieCarousel from "./MovieCarousel";

type Props = {
  items: any[];
  id: number;
  mediaType: "movie" | "tv";
  titleKey: string;
};

export default function SimilarCarousel({
  items,
  id,
  mediaType,
  titleKey,
}: Props) {
  const { t } = useTranslation(
    mediaType === "movie" ? "movieDetails" : "tvDetails",
  );

  if (!items.length) return null;

  return (
    <MovieCarousel
      items={items}
      title={t(titleKey)}
      viewAllLink={{
        to: `/${mediaType}/${id}/similar`,
        label: t("common:view_all"),
        icon: <FiFilm />,
      }}
    />
  );
}
