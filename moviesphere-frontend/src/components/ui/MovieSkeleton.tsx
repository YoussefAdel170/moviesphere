// src/components/ui/skeleton/MovieSkeleton.tsx

export default function MovieSkeleton() {
  return (
    <div
      className="
        rounded-xl overflow-hidden
        bg-[var(--surface-secondary)]
        border border-[var(--border-light)]
        animate-pulse
      "
    >
      {/* image */}
      <div className="h-[300px] bg-[var(--bg-tertiary)]" />

      {/* text */}
      <div className="p-3 space-y-3">
        <div className="h-4 rounded w-3/4 bg-[var(--bg-tertiary)]" />
        <div className="h-3 rounded w-1/2 bg-[var(--bg-tertiary)]" />
      </div>
    </div>
  );
}