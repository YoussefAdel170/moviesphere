// src/components/ui/watchProviders/WatchProviders.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../hooks/utilities/useImageUrl";
import { IMAGE_SIZES } from "../../../constants/images";
import type { Provider } from "../../../hooks/useWatchProviders";
import "./WatchProviders.scss";

type Props = {
  providers: Provider[];
  streamingLink?: string;
  loading?: boolean;
};

export default function WatchProviders({
  providers,
  streamingLink,
  loading = false,
}: Props) {
  const { t } = useTranslation("movieDetails");

  if (loading) {
    return (
      <div className="watch-providers-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-logos">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-logo"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!providers.length) return null;

  const content = (
    <div className="providers-logos">
      {providers.map((provider) => (
        <motion.div
          key={provider.provider_id}
          className="provider-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          title={provider.provider_name}
        >
          <img
            src={getImageUrl(provider.logo_path, IMAGE_SIZES.logo.medium) || ""}
            alt={provider.provider_name}
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="watch-providers">
      <p className="providers-label">{t("where_to_watch")}</p>
      {streamingLink ? (
        <a
          href={streamingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="providers-link-wrapper"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
