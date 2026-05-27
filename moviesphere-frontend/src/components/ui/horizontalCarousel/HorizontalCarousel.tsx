// src/components/ui/HorizontalCarousel/HorizontalCarousel.tsx
import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./HorizontalCarousel.scss";

type Props = {
  title: string; // i18n key or raw text
  viewAllLink?: {
    to: string;
    label?: string;
    icon?: ReactNode;
  };
  items: any[]; // array of items to display
  renderItem: (item: any, index: number) => ReactNode;
  itemWidth?: number; // width of each item in pixels (default: 180)
  gap?: number; // gap between items in pixels (default: 24)
  scrollAmount?: number; // how many pixels to scroll per arrow click (default: itemWidth * 3)
};

export default function HorizontalCarousel({
  title,
  viewAllLink,
  items,
  renderItem,
  itemWidth = 180,
  gap = 24,
  scrollAmount: customScrollAmount,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollAmount = customScrollAmount ?? itemWidth * 3;

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const delta = direction === "left" ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + delta,
        behavior: "smooth",
      });
      setTimeout(updateArrows, 200);
    }
  };

  if (!items.length) return null;

  return (
    <div className="horizontal-carousel">
      <div className="carousel-header">
        <h2>{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink.to} className="view-all-link">
            {viewAllLink.icon}
            {viewAllLink.label && <span>{viewAllLink.label}</span>}
          </Link>
        )}
      </div>

      <div className="carousel-container">
        <button
          className={`carousel-arrow left ${showLeftArrow ? "visible" : "hidden"}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>

        <div
          className="carousel-track"
          ref={scrollRef}
          onScroll={updateArrows}
          style={{ gap: `${gap}px` }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="carousel-item"
              style={{ width: `${itemWidth}px`, flexShrink: 0 }}
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>

        <button
          className={`carousel-arrow right ${showRightArrow ? "visible" : "hidden"}`}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
