/**
 * ToolCardSkeleton
 * Matches the exact shape of ToolCard so the layout doesn't shift when
 * real content loads. Used in ToolBrowser loading state and the home page.
 */
export function ToolCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col justify-between gap-6 rounded-lg border border-border bg-card p-6"
    >
      {/* Top block */}
      <div className="flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="h-5 w-10 animate-pulse rounded bg-secondary" />
        </div>
        {/* Description lines */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-secondary" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-secondary" />
        </div>
      </div>

      {/* Bottom row — category pill + view-details chip */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
        <div className="h-7 w-24 animate-pulse rounded-md bg-secondary" />
      </div>
    </div>
  );
}
