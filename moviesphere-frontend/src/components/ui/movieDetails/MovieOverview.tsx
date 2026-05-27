// src/components/ui/movieDetails/MovieOverview.tsx
import { useTranslation } from "react-i18next";

type Props = {
  overview: string;
};

export default function MovieOverview({ overview }: Props) {
  const { t } = useTranslation("movieDetails");
  return (
    <div className="overview">
      <h2>{t("overview")}</h2>
      <p>{overview}</p>
    </div>
  );
}
