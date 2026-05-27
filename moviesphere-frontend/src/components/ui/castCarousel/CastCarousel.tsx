// src/components/ui/castCarousel/CastCarousel.tsx
import { useTranslation } from "react-i18next";
import { FiUsers } from "react-icons/fi";
import type { CastMember } from "../../../types/castMemberType";
import { getImageUrl } from "../../../hooks/utilities/useImageUrl";
import { IMAGE_SIZES } from "../../../constants/images";
import HorizontalCarousel from "../horizontalCarousel/HorizontalCarousel";
import "./CastCarousel.scss";

type Props = {
  cast: CastMember[];
  movieId: number;
};

export default function CastCarousel({ cast, movieId }: Props) {
  const { t } = useTranslation("movieDetails");

  const renderCastCard = (person: CastMember) => (
    <div
      className="cast-carousel-card"
      title={
        person.character
          ? person.name +
            " " +
            t("as_character", { character: person.character })
          : t("unknown_character", "Character unknown")
      }
    >
      <div className="cast-carousel-image-wrapper">
        {person.profile_path ? (
          <img
            src={
              getImageUrl(person.profile_path, IMAGE_SIZES.profile.small) || ""
            }
            alt={person.name}
            loading="lazy"
          />
        ) : (
          <div className="no-image">
            <span>🎭</span>
            <span>{t("no_photo", "No photo")}</span>
          </div>
        )}
      </div>
      <div className="cast-carousel-info">
        <p className="cast-name">{person.name}</p>
        <p className="cast-character">{person.character}</p>
      </div>
    </div>
  );

  const limitedCast = cast.slice(0, 12);
  const hasMore = cast.length > 12;

  return (
    <HorizontalCarousel
      title={t("cast_title", "Top Cast")}
      viewAllLink={
        hasMore
          ? {
              to: `/movie/${movieId}/cast`,
              label: t("view_all_cast", "View All Cast"),
              icon: <FiUsers />,
            }
          : undefined
      }
      items={limitedCast}
      renderItem={renderCastCard}
      itemWidth={100}
      gap={16}
      scrollAmount={300}
    />
  );
}
