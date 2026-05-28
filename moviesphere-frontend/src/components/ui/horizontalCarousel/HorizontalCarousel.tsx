// src/components/ui/HorizontalCarousel/HorizontalCarousel.tsx
import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./HorizontalCarousel.scss";

type Props = {
  title: string;
  viewAllLink?: {
    to: string;
    label?: string;
    icon?: ReactNode;
  };
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemWidth?: number;
  gap?: number;
  scrollAmount?: number;
};

function getNormalizedScrollLeft(el: HTMLElement, isRTL: boolean): number {
  if (!isRTL) return el.scrollLeft;
  return Math.abs(el.scrollLeft);
}

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [rtl, setRtl] = useState(false);

  const scrollAmount = customScrollAmount ?? itemWidth * 3;

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isRTL = getComputedStyle(el).direction === "rtl";
    setRtl(isRTL);
    const normalized = getNormalizedScrollLeft(el, isRTL);
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (isRTL) {
      setCanScrollRight(normalized > 20);
      setCanScrollLeft(normalized < maxScroll - 20);
    } else {
      setCanScrollLeft(normalized > 20);
      setCanScrollRight(normalized < maxScroll - 20);
    }
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // No RTL flip needed here — the icons are already swapped visually,
    // so "left" always means physically scroll left (negative scrollLeft delta)
    // and "right" always means physically scroll right, in both LTR and RTL.
    const delta = direction === "left" ? -scrollAmount : scrollAmount;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
    setTimeout(updateArrows, 200);
  };

  if (!items.length) return null;

  // In RTL the left button scrolls toward the end (more content),
  // so it should point RIGHT (→). The right button goes back to start, points LEFT (←).
  const LeftIcon = rtl ? FiChevronRight : FiChevronLeft;
  const RightIcon = rtl ? FiChevronLeft : FiChevronRight;

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
          className="carousel-arrow left"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <LeftIcon />
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
          className="carousel-arrow right"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <RightIcon />
        </button>
      </div>
    </div>
  );
}
