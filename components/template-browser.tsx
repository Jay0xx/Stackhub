"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  templates,
  filterTemplates,
  TEMPLATE_CATEGORIES,
  type Template,
  type TemplateCategory,
} from "@/data/templates";

export function TemplateBrowser() {
  const [active, setActive] = useState<TemplateCategory>("All");

  const visible = filterTemplates(templates, active);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Category filter pills ── */}
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active === cat
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-[#CCCCCC] hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No templates in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      )}

      {/* ── Count ── */}
      <p className="text-xs text-muted-foreground">
        {visible.length} template{visible.length !== 1 ? "s" : ""}
        {active !== "All" ? ` in ${active}` : " total"}
      </p>
    </div>
  );
}

/* ── Template Card ───────────────────────────────────────────────────────── */

function TemplateCard({ template: t }: { template: Template }) {
  return (
    <article className="group flex h-full flex-col gap-5 rounded-lg border border-border bg-card p-6 transition-colors hover:border-[#CCCCCC]">
      {/* Top: name + category */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground leading-snug">
            {t.name}
          </h3>
          <CategoryPill label={t.category} />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {t.description}
        </p>
      </div>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5">
        {t.stack.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions — pinned to bottom */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        {t.deployUrl && (
          <Link
            href={t.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3.5 text-[11px] font-medium text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Deploy ${t.name}${t.deployLabel ? ` on ${t.deployLabel}` : ""}`}
          >
            <DeployIcon />
            Deploy
            {t.deployLabel && (
              <span className="opacity-60">· {t.deployLabel}</span>
            )}
          </Link>
        )}
        <Link
          href={t.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:border-[#CCCCCC] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`View ${t.name} on GitHub`}
        >
          <GithubIcon />
          GitHub
        </Link>
      </div>
    </article>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {label}
    </span>
  );
}

function DeployIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 17 4-4 4 4" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
