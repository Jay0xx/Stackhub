import Link from "next/link";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LiveStarBadge } from "@/components/live-star-badge";

interface ToolCardProps {
  tool: Tool;
  className?: string;
  /** Compact variant for Related Tools — smaller, no star / description. */
  compact?: boolean;
  /** Show a subtle "New" badge — used in the Recently Added section. */
  isNew?: boolean;
}

/**
 * Minimal tool card — thin border, generous padding, no shadow, no color.
 *
 * The entire card is a single <Link>. "View details" is a visual affordance
 * (a non-interactive styled span), NOT a nested <a> — nesting interactive
 * elements produces invalid HTML and breaks Next.js router hydration.
 */
export function ToolCard({ tool, className, compact = false, isNew = false }: ToolCardProps) {
  const href = `/tools/${tool.slug}`;

  if (compact) {
    return (
      <Link
        href={href}
        aria-label={`View ${tool.name}`}
        className={cn(
          "group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-[#CCCCCC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {tool.name}
          </h3>
          <ArrowIcon className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
        <CategoryPill label={tool.category} className="mt-auto" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`View ${tool.name}`}
      className={cn(
        "group flex h-full flex-col justify-between gap-6 rounded-lg border border-border bg-card p-6 transition-colors hover:border-[#CCCCCC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {tool.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5">
            {isNew && <NewBadge />}
            <LiveStarBadge
              fallback={tool.stars}
              githubUrl={tool.links?.github}
              variant="card"
            />
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <CategoryPill label={tool.category} />

        {/* Visual affordance only — not an interactive element. */}
        <span
          aria-hidden="true"
          className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition-colors group-hover:border-[#CCCCCC] group-hover:bg-secondary"
        >
          View details
          <ArrowIcon className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </span>
      </div>
    </Link>
  );
}

function CategoryPill({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

function NewBadge() {
  return (
    <span className="inline-flex items-center rounded border border-border bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
      New
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

function ArrowIcon({ className }: { className?: string }) {
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
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
