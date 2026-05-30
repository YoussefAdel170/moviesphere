import { useTranslation } from "react-i18next";
import { FiTv, FiCalendar } from "react-icons/fi";
import HorizontalCarousel from "../horizontalCarousel/HorizontalCarousel";
import { getImageUrl } from "../../../hooks/utilities/useImageUrl";
import { IMAGE_SIZES } from "../../../constants/images";
import type { Season } from "../../../types/tvTypes";
import "./SeasonsCarousel.scss";

type Props = {
  seasons: Season[];
  tvId: number;
};

export default function SeasonsCarousel({ seasons, tvId: _tvId }: Props) {
  const { t } = useTranslation("tvDetails");

  if (!seasons.length) return null;

  const renderSeasonCard = (season: Season) => (
    <div className="season-card">
      <div className="season-image">
        {season.poster_path ? (
          <img
            src={
              getImageUrl(season.poster_path, IMAGE_SIZES.poster.medium) || ""
            }
            alt={season.name}
            loading="lazy"
          />
        ) : (
          <div className="no-image">
            <FiTv />
          </div>
        )}
      </div>
      <div className="season-info">
        <p className="season-name">{season.name}</p>
        <p className="season-episodes">
          <FiCalendar size={12} /> {season.episode_count} {t("episodes")}
        </p>
        <p className="season-year">
          {season.air_date ? new Date(season.air_date).getFullYear() : "TBA"}
        </p>
      </div>
    </div>
  );

  return (
    <HorizontalCarousel
      title={t("seasons")}
      items={seasons}
      renderItem={renderSeasonCard}
      itemWidth={160}
      gap={16}
      scrollAmount={320}
    />
  );
}
