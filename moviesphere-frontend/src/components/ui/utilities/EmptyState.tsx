// src/components/ui/EmptyState/EmptyState.tsx
import { motion } from "framer-motion";
import "./EmptyState.scss";
import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function EmptyState({
  icon = "📭",
  title,
  message,
  buttonText,
  onButtonClick,
}: Props) {
  return (
    <div className="empty-state-wrapper">
      <motion.div
        className="empty-state-card"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="empty-state-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{message}</p>
        {buttonText && onButtonClick && (
          <button onClick={onButtonClick}>{buttonText}</button>
        )}
      </motion.div>
    </div>
  );
}
