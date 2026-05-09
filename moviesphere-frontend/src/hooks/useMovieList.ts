// src/hooks/useMoviesList.ts
import { useMemo } from "react";

export function useMoviesList() {
  // Animation variants (static, no need for state)
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
        },
      },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    }),
    [],
  );

  return {
    containerVariants,
    itemVariants,
  };
}
