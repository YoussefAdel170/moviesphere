// src/components/ui/emptyMoviesState/EmptyMoviesState.tsx
import { motion } from "framer-motion";
import "./EmptyMoviesState.scss";
import { useTranslation } from "react-i18next";
import { FiFilm } from "react-icons/fi";

type Props = {
  onClearSearch: () => void;
};

export default function EmptyMoviesState({ onClearSearch }: Props) {
  const { t } = useTranslation("emptyState");

  return (
    <div className="movies-empty-wrapper">
      <motion.div
        className="movies-empty-card"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="movies-empty-icon">
          <FiFilm />
        </div>

        <h2>{t("no_movies_title")}</h2>

        <p>{t("no_movies_message")}</p>

        <button onClick={onClearSearch}>{t("back_to_popular")}</button>
      </motion.div>
    </div>
  );
}
