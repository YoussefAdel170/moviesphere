// src/hooks/usePagination.ts
import { useCallback } from "react";

type UsePaginationProps = {
  onPageChange: (page: number) => void;
};

export function usePagination({ onPageChange }: UsePaginationProps) {
  const handleChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onPageChange],
  );

  return { handleChange };
}
