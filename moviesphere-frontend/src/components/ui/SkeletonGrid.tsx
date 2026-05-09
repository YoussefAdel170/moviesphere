import MovieSkeleton from "./MovieSkeleton";

type Props = {
  count?: number;
};

export default function SkeletonGrid({ count = 20 }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
        gap-5
        px-6
        mt-20
      "
    >
      {Array.from({ length: count }).map((_, i) => (
        <MovieSkeleton key={i} />
      ))}
    </div>
  );
}
