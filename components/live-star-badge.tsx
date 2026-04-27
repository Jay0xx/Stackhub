"use client";

import { useLiveStars } from "@/hooks/use-live-stars";
import { cn } from "@/lib/utils";

interface LiveStarBadgeProps {
  /** Pre-formatted fallback star count from Supabase, e.g. "6.1k" */
  fallback: string;
  /** GitHub repo URL — if absent the fallback is shown statically */
  githubUrl?: string;
  /** "card" = compact inline badge | "detail" = larger pill on the detail page */
  variant?: "card" | "detail";
}

/**
 * Client island that shows a live GitHub star count fetched on mount.
 * Falls back to the Supabase value silently on any error.
 *
 * Designed to be dropped into server components — it hydrates independently.
 */
export function LiveStarBadge({
  fallback,
  githubUrl,
  variant = "card",
}: LiveStarBadgeProps) {
  const { display, live, loading } = useLiveStars(githubUrl, fallback);

  if (variant === "detail") {
    return (
      <span
        className="inline-flex shrink-0 flex-col items-end gap-0.5"
        aria-label={`${display} GitHub stars`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
          <StarIcon />
          <span
            className={cn(
              "font-medium text-foreground tabular-nums transition-opacity",
              loading && "opacity-40",
            )}
          >
            {display}
          </span>
          <span>stars</span>
        </span>
        {/* Subtle live/fallback indicator below the pill */}
        <span className="text-[10px] text-muted-foreground/60 pr-1">
          {loading ? "fetching…" : live ? "live" : "cached"}
        </span>
      </span>
    );
  }

  // card variant — compact inline
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
      aria-label={`${display} GitHub stars`}
    >
      <StarIcon />
      <span
        className={cn(
          "tabular-nums transition-opacity",
          loading && "opacity-40",
        )}
      >
        {display}
      </span>
      {live && (
        <span
          className="text-[9px] text-muted-foreground/50 leading-none"
          aria-label="live data"
          title="Fetched live from GitHub"
        >
          ↻
        </span>
      )}
    </span>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
