import { useState } from "react";
import type { MouseEvent } from "react";

export function useStarRatingFilter(
  value: number,
  onChange: (val: number) => void,
) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Convert 0-10 rating to 0-5 stars
  const rating = value / 2;

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const getStarState = (starIndex: number): "full" | "half" | "empty" => {
    const starValue = starIndex + 1;

    if (displayValue >= starValue) {
      return "full";
    }

    if (displayValue >= starValue - 0.5) {
      return "half";
    }

    return "empty";
  };

  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    let starValue = starIndex + 1;

    if (isHalf) {
      starValue -= 0.5;
    }

    const newRating = starValue * 2;

    onChange(newRating);
  };

  const handleMouseMove = (
    starIndex: number,
    event: MouseEvent<HTMLElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;

    const isHalf = mouseX < rect.width / 2;

    let starValue = starIndex + 1;

    if (isHalf) {
      starValue -= 0.5;
    }

    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return {
    getStarState,
    handleStarClick,
    handleMouseMove,
    handleMouseLeave,
  };
}
