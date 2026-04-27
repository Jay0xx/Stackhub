"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { CATEGORIES, type Category, type Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSearchFocus } from "@/hooks/use-search-focus";

// ── Constants ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

// ── Sort ──────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "stars",   label: "Most Stars" },
  { value: "newest",  label: "Recently Added" },
  { value: "az",      label: "A–Z" },
  { value: "updated", label: "Last Updated" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

function sortTools(tools: Tool[], key: SortKey): Tool[] {
  const arr = [...tools];
  switch (key) {
    case "stars":
      return arr.sort((a, b) =>
        b.starsRaw !== a.starsRaw
          ? b.starsRaw - a.starsRaw
          : a.name.localeCompare(b.name),
      );
    case "newest":
      return arr.sort((a, b) => {
        const diff =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "updated":
      return arr.sort((a, b) => {
        const diff =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return diff !== 0 ? diff : b.starsRaw - a.starsRaw;
      });
  }
}

// ── Props ─────────────────────────────────────────────────────────────────

interface ToolBrowserProps {
  tools: Tool[];
  sectionHeading?: string;
  sectionId?: string;
  showCounts?: boolean;
  /** When true, renders skeletons instead of the real grid (loading state). */
  loading?: boolean;
  /** When set, shows an error banner with a retry button. */
  error?: string | null;
  onRetry?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function ToolBrowser({
  tools,
  sectionHeading = "Tools",
  sectionId = "tools-heading",
  showCounts = false,
  loading = false,
  error = null,
  onRetry,
}: ToolBrowserProps) {
  const [query, setQuery]             = useState("");
  const [activeCategory, setCategory] = useState<Category>("All");
  const [sortKey, setSortKey]         = useState<SortKey>("stars");
  const [page, setPage]               = useState(1);

  // "Back to top" visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // "/" keyboard shortcut — focuses this input from anywhere on the page
  const searchRef = useRef<HTMLInputElement>(null);
  useSearchFocus(searchRef);

  // Show "back to top" button after scrolling down 400px
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any control change that should jump back to page 1.
  function changeQuery(v: string)       { setQuery(v);    setPage(1); }
  function changeCategory(v: Category)  { setCategory(v); setPage(1); }
  function changeSort(v: SortKey)       { setSortKey(v);  setPage(1); }

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setSortKey("stars");
    setPage(1);
  }

  const hasActiveFilters = query !== "" || activeCategory !== "All";

  // ── 1. Filter ────────────────────────────────────────────────────────────
  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCat =
        activeCategory === "All" || tool.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        (tool.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [tools, query, activeCategory]);

  // ── 2. Sort ──────────────────────────────────────────────────────────────
  const sortedTools = useMemo(
    () => sortTools(filteredTools, sortKey),
    [filteredTools, sortKey],
  );

  // ── 3. Paginate ──────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sortedTools.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageTools  = sortedTools.slice(pageStart, pageStart + PAGE_SIZE);

  // ── 4. Category counts (for pill badges) ─────────────────────────────────
  const counts = useMemo<Record<string, number>>(() => {
    if (!showCounts) return {};
    const q = query.trim().toLowerCase();
    const base = q
      ? tools.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q),
        )
      : tools;
    const result: Record<string, number> = { All: base.length };
    for (const cat of CATEGORIES) {
      if (cat !== "All")
        result[cat] = base.filter((t) => t.category === cat).length;
    }
    return result;
  }, [tools, query, showCounts]);

  // Result summary
  const total = sortedTools.length;
  const resultLabel =
    activeCategory !== "All"
      ? `${total} ${total === 1 ? "tool" : "tools"} in ${activeCategory}`
      : `${total} ${total === 1 ? "tool" : "tools"}`;

  return (
    <div className="flex flex-col gap-10">

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary px-4 py-3">
          <div className="flex items-center gap-2.5 text-xs text-foreground">
            <AlertIcon />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 text-xs font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* ── Search + Sort ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Search tools, libraries, or documentation..."
            aria-label="Search tools, libraries, or documentation"
            disabled={loading}
            className="h-14 w-full rounded-lg border-border bg-background pl-11 pr-16 text-[15px] placeholder:text-muted-foreground focus-visible:border-[#999999] focus-visible:ring-0 disabled:opacity-40"
          />
          {!query && (
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden items-center rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground/60 sm:flex"
            >
              /
            </kbd>
          )}
        </div>
        <SortSelect value={sortKey} onChange={changeSort} disabled={loading} />
      </div>

      {/* ── Category pills ── */}
      <nav
        aria-label="Filter by category"
        className="-mx-6 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            const count = showCounts ? counts[cat] : undefined;
            return (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => changeCategory(cat)}
                  aria-pressed={active}
                  disabled={loading}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-40",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-[#CCCCCC] hover:text-foreground",
                  )}
                >
                  {cat}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "tabular-nums",
                        active ? "opacity-70" : "opacity-50",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Results section ── */}
      <section aria-labelledby={sectionId} className="flex flex-col gap-8">

        {/* Section header: title + total count */}
        <header className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <h2
            id={sectionId}
            className="text-base font-medium tracking-tight text-foreground"
          >
            {sectionHeading}
          </h2>
          {!loading && (
            <p
              className="text-xs text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultLabel}
            </p>
          )}
        </header>

        {/* Loading skeleton grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedTools.length > 0 ? (
          <>
            {/* Tool grid — only the current page slice */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>

            {/* Pagination — only rendered when more than one page exists */}
            {totalPages > 1 && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            )}
          </>
        ) : (
          <EmptyState
            query={query}
            category={activeCategory}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />
        )}
      </section>

      {/* ── Back to top ── */}
      <BackToTop visible={showBackToTop} />
    </div>
  );
}

// ── Back to top ───────────────────────────────────────────────────────────

function BackToTop({ visible }: { visible: boolean }) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-8 right-8 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all duration-200",
        "text-muted-foreground hover:border-[#999999] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <ArrowUpIcon />
    </button>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  const isFirst = page === 1;
  const isLast  = page === totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-6 border-t border-border pt-8"
    >
      {/* Previous */}
      {!isFirst ? (
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Go to previous page"
        >
          <ArrowLeftIcon />
          Previous
        </button>
      ) : (
        <span className="w-[82px]" aria-hidden="true" />
      )}

      {/* Page indicator */}
      <span className="text-xs tabular-nums text-muted-foreground">
        Page{" "}
        <span className="font-medium text-foreground">{page}</span>
        {" "}of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>

      {/* Next */}
      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Go to next page"
        >
          Next
          <ArrowRightIcon />
        </button>
      ) : (
        <span className="w-[82px]" aria-hidden="true" />
      )}
    </nav>
  );
}

// ── Sort select ───────────────────────────────────────────────────────────

function SortSelect({
  value,
  onChange,
  disabled,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        aria-label="Sort tools"
        disabled={disabled}
        className={cn(
          "h-14 appearance-none rounded-lg border border-border bg-background",
          "pl-3 pr-8 text-[13px] font-medium text-foreground",
          "cursor-pointer transition-colors",
          "hover:border-[#CCCCCC]",
          "focus-visible:outline-none focus-visible:border-[#999999]",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────

function EmptyState({
  query,
  category,
  hasActiveFilters,
  onClear,
}: {
  query: string;
  category: Category;
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  let message: string;
  if (query && category !== "All") {
    message = `No results for "${query}" in ${category}.`;
  } else if (query) {
    message = `No results for "${query}".`;
  } else {
    message = `No tools in ${category} yet.`;
  }

  const suggestion =
    query && category !== "All"
      ? "Try a different keyword, or clear the category filter."
      : query
      ? "Try a different keyword, or browse all categories."
      : "Check back later — new tools are added regularly.";

  return (
    <div className="flex flex-col items-center gap-5 rounded-lg border border-dashed border-border bg-background px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
        <SearchIcon className="text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          {suggestion}
        </p>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-[#CCCCCC] hover:bg-secondary"
        >
          <XIcon />
          Clear filters
        </button>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 19V5" />
      <path d="m5 11 7-7 7 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}
