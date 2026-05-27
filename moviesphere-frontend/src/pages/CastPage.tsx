// src/pages/CastPage.tsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import { useCastPage } from "../hooks/useCastPage";
import { getImageUrl } from "../hooks/utilities/useImageUrl";
import { IMAGE_SIZES } from "../constants/images";
import MediaListPage from "./generic/MediaListPage";
import "./CastPage.scss";

const ITEMS_PER_PAGE = 20;

export default function CastPage() {
  const { id } = useParams();
  const { t } = useTranslation("movieDetails");
  const { cast, loading, error, movieTitle } = useCastPage(id);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cast.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCast = cast.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCastCard = (person: any) => (
    <div className="cast-card">
      {" "}
      {/* your existing card markup */}
      <div className="cast-image-wrapper">
        {person.profile_path ? (
          <img
            src={
              getImageUrl(person.profile_path, IMAGE_SIZES.profile.medium) || ""
            }
            alt={person.name}
          />
        ) : (
          <div className="no-image">
            <FiUser />
            <span>{t("no_photo")}</span>
          </div>
        )}
      </div>
      <div className="cast-info">
        <p className="actor-name">{person.name}</p>
        <p className="character-name">{person.character}</p>
      </div>
    </div>
  );

  return (
    <MediaListPage
      items={paginatedCast}
      loading={loading}
      error={error}
      errorMessage={t("error_loading_cast")}
      emptyStateConfig={{
        icon: "🎭",
        title: t("no_cast_found"),
        message: t("no_cast_message"),
      }}
      backLinkTo={`/movie/${id}`}
      backLinkText={t("back_to_movie", { title: movieTitle })}
      title={t("full_cast_with_title", { title: movieTitle })}
      renderItem={renderCastCard}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
      }}
    />
  );
}
