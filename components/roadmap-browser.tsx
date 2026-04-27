"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { roadmaps, type Roadmap, type Difficulty } from "@/data/roadmaps";

/* ── Difficulty helpers ──────────────────────────────────────────────────── */

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

/* ── Main component ──────────────────────────────────────────────────────── */

export function RoadmapBrowser() {
  const [active, setActive] = useState<Roadmap | null>(null);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) setActive(null);
    },
    [active],
  );

  // Lock body scroll while modal is open
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, handleKeyDown]);

  return (
    <>
      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.slug}
            roadmap={roadmap}
            onOpen={() => setActive(roadmap)}
          />
        ))}
      </div>

      {/* ── Detail modal ── */}
      {active && (
        <RoadmapModal roadmap={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}

/* ── Roadmap card ────────────────────────────────────────────────────────── */

function RoadmapCard({
  roadmap,
  onOpen,
}: {
  roadmap: Roadmap;
  onOpen: () => void;
}) {
  return (
    <article className="group flex h-full flex-col gap-5 rounded-lg border border-border bg-card p-6 transition-colors hover:border-[#CCCCCC]">
      {/* Top metadata row */}
      <div className="flex items-center justify-between gap-3">
        <DifficultyPill level={roadmap.difficulty} />
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {roadmap.duration}
        </span>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold leading-snug tracking-tight text-foreground">
          {roadmap.title}
        </h2>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {roadmap.description}
        </p>
      </div>

      {/* Step count — pinned above button */}
      <p className="mt-auto text-[11px] text-muted-foreground">
        {roadmap.steps.length} tools
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background text-[11px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Start roadmap: ${roadmap.title}`}
      >
        Start Roadmap
        <ArrowRightIcon />
      </button>
    </article>
  );
}

/* ── Difficulty pill ─────────────────────────────────────────────────────── */

function DifficultyPill({ level }: { level: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
        DIFFICULTY_ORDER[level] === 0 &&
          "border-border bg-secondary text-muted-foreground",
        DIFFICULTY_ORDER[level] === 1 &&
          "border-[#333333] bg-[#111111] text-[#CCCCCC]",
        DIFFICULTY_ORDER[level] === 2 &&
          "border-foreground bg-foreground text-background",
      )}
    >
      {level}
    </span>
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */

function RoadmapModal({
  roadmap,
  onClose,
}: {
  roadmap: Roadmap;
  onClose: () => void;
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={roadmap.title}
    >
      {/* Dimmed overlay — click to close */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-xl border border-border bg-background sm:max-w-2xl sm:rounded-xl">

        {/* ── Modal header ── */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyPill level={roadmap.difficulty} />
              <span className="text-xs text-muted-foreground">
                {roadmap.duration}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {roadmap.steps.length} tools
              </span>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {roadmap.title}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              {roadmap.description}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-[#CCCCCC] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close roadmap detail"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable step list ── */}
        <ol className="flex flex-col overflow-y-auto p-6 gap-0">
          {roadmap.steps.map((step, idx) => (
            <li key={step.toolSlug} className="flex gap-4">
              {/* Step spine */}
              <div className="flex flex-col items-center">
                {/* Number bubble */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {idx + 1}
                </span>
                {/* Connecting line — hidden on last item */}
                {idx < roadmap.steps.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                )}
              </div>

              {/* Step content */}
              <div
                className={cn(
                  "flex flex-col gap-1 pb-6",
                  idx === roadmap.steps.length - 1 && "pb-0",
                )}
              >
                <div className="flex items-center gap-2">
                  <Link
                    href={`/tools/${step.toolSlug}`}
                    onClick={onClose}
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {step.toolName}
                  </Link>
                  <ArrowUpRightIcon className="text-muted-foreground/50" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ── Modal footer ── */}
        <div className="shrink-0 border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Click any tool name to view its full documentation, quickstarts,
            and community notes on StackHub.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

function ArrowRightIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
