// src/components/ui/movieDetails/MovieInfoGrid.tsx
import { useTranslation } from "react-i18next";
import { FiDollarSign, FiGlobe, FiFilm } from "react-icons/fi";

type Props = {
  budget: number;
  revenue: number;
  originalLanguage: string;
  status: string;
  formatCurrency: (value: number) => string;
};

export default function MovieInfoGrid({
  budget,
  revenue,
  originalLanguage,
  status,
  formatCurrency,
}: Props) {
  const { t } = useTranslation("movieDetails");
  return (
    <div className="info-grid">
      <div className="info-card">
        <FiDollarSign />
        <h3>{t("budget")}</h3>
        <p>{formatCurrency(budget)}</p>
      </div>
      <div className="info-card">
        <FiDollarSign />
        <h3>{t("revenue")}</h3>
        <p>{formatCurrency(revenue)}</p>
      </div>
      <div className="info-card">
        <FiGlobe />
        <h3>{t("original_language")}</h3>
        <p>{originalLanguage.toUpperCase()}</p>
      </div>
      <div className="info-card">
        <FiFilm />
        <h3>{t("status")}</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}
