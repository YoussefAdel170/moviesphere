import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiStar, FiPlay, FiTv, FiChevronDown } from "react-icons/fi";
import "./HeroSection.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

type Props = {
  onScrollHintClick: () => void;
};

export default function HeroSection({ onScrollHintClick }: Props) {
  const { t } = useTranslation("home");

  return (
    <section className="hero-section">
      <div className="hero-overlay" />

      <div className="hero-content">
        <motion.div
          className="hero-badge"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <FiStar /> {t("hero_badge", "Discover · Watch · Explore")}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          {t("hero_title")}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.2}
        >
          {t("hero_subtitle")}
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.32}
        >
          <Link to="/movies" className="btn-primary">
            <FiPlay /> {t("hero_cta_primary", "Browse Movies")}
          </Link>
          <Link to="/tv" className="btn-ghost">
            <FiTv /> {t("hero_cta_ghost", "TV Shows")}
          </Link>
        </motion.div>
      </div>

      <button
        className="hero-scroll-hint"
        aria-label="Scroll to content"
        onClick={onScrollHintClick}
      >
        <FiChevronDown />
      </button>
    </section>
  );
}
