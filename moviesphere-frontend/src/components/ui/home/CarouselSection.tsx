import type { ReactNode } from "react";
import HorizontalCarousel from "../horizontalCarousel/HorizontalCarousel";
import SkeletonGrid from "../SkeletonGrid";

type Props = {
  title: string;
  viewAllLink: {
    to: string;
    label: string;
    icon?: ReactNode;
  };
  items: any[];
  loading: boolean;
  renderItem: (item: any, index: number) => ReactNode;
};

export default function CarouselSection({
  title,
  viewAllLink,
  items,
  loading,
  renderItem,
}: Props) {
  if (loading) return <SkeletonGrid count={5} />;

  return (
    <section className="carousel-section">
      <HorizontalCarousel
        title={title}
        viewAllLink={viewAllLink}
        items={items}
        renderItem={renderItem}
        itemWidth={180}
        gap={24}
      />
    </section>
  );
}
