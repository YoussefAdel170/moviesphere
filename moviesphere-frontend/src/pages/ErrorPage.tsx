// src/pages/ErrorPage.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./ErrorPage.scss";

type Props = { message?: string };

export default function ErrorPage({ message }: Props) {
  const { t } = useTranslation("errorPage");

  const displayMessage = message || t("default_message");

  return (
    <div className="error-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="error-card"
      >
        <div className="error-icon">🎬</div>

        <h1>{t("title")}</h1>

        <p className="error-message">{displayMessage}</p>

        <button onClick={() => window.location.reload()}>
          {t("retry_button")}
        </button>
      </motion.div>
    </div>
  );
}
