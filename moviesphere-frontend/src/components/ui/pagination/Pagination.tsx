// src/components/ui/pagination/Pagination.tsx
import { Pagination as MuiPagination } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePagination } from "../../../hooks/usePagination";
import "./Pagination.scss";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation("pagination");
  const { handleChange } = usePagination({ onPageChange });

  if (totalPages <= 1) return null;

  const getItemAriaLabel = (
    type:
      | "first"
      | "last"
      | "next"
      | "previous"
      | "page"
      | "start-ellipsis"
      | "end-ellipsis",
    page: number | null,
    _selected: boolean
  ) => {
    switch (type) {
      case "first":
        return t("first_page");
      case "last":
        return t("last_page", { totalPages });
      case "next":
        return t("next_page");
      case "previous":
        return t("previous_page");
      case "page":
        return t("page_number", { page });
      case "start-ellipsis":
      case "end-ellipsis":
        return t("more_pages");
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="pagination-wrapper"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <MuiPagination
        className="pagination"
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        getItemAriaLabel={getItemAriaLabel}
      />
    </motion.div>
  );
}