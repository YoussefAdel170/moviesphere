// src/components/ui/movieDetails/ProductionCompanies.tsx
import { useTranslation } from "react-i18next";

type Company = {
  id: number;
  logo_path: string | null;
  name: string;
};

type Props = {
  companies: Company[];
};

export default function ProductionCompanies({ companies }: Props) {
  const { t } = useTranslation("movieDetails");
  if (!companies.length) return null;

  return (
    <div className="production">
      <h2>{t("production_companies")}</h2>
      <div className="companies">
        {companies.map((company) => (
          <div key={company.id} className="company">
            {company.logo_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                alt={company.name}
                loading="lazy"
              />
            ) : (
              <div className="company-fallback">{company.name.charAt(0)}</div>
            )}
            <span>{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
