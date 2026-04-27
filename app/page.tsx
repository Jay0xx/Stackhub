import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { DiscoverControls } from "@/components/discover-controls";
import { ToolCard } from "@/components/tool-card";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { getFeaturedTools, getRecentTools } from "@/lib/data";

export const metadata: Metadata = {
  title: "StackHub — Web3 Developer Tools & Documentation",
  description:
    "The central hub for Web3 developer tools and documentation. Discover, compare, and learn the best libraries, frameworks, and infrastructure for building on-chain.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "StackHub — Web3 Developer Tools & Documentation",
    description:
      "Discover, compare, and learn the best Web3 developer tools — wagmi, Hardhat, Foundry, The Graph, and more.",
    url: "/",
  },
  twitter: {
    title: "StackHub — Web3 Developer Tools & Documentation",
    description:
      "Discover, compare, and learn the best Web3 developer tools.",
  },
};

export default async function DiscoverPage() {
  // Fetch both in parallel — no waterfall. Each helper returns [] on error,
  // so the page always renders even when Supabase is unreachable.
  const [featured, recent] = await Promise.all([
    getFeaturedTools(8),
    getRecentTools(6),
  ]);

  const hasContent = featured.length > 0 || recent.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b border-border">
        <Container className="flex flex-col items-center gap-3 py-16 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Discover
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            StackHub
          </h1>
          <p className="max-w-xl text-balance text-base text-muted-foreground">
            The central hub for Web3 developer tools and documentation.
          </p>
        </Container>
      </section>

      {/* ── Featured Tools / Empty State ── */}
      <Container className="py-12 sm:py-16">
        {featured.length > 0 ? (
          <>
            <DiscoverControls
              tools={featured}
              sectionHeading="Featured Tools"
              sectionId="featured-tools-heading"
            />
            <div className="mt-12 flex justify-center border-t border-border pt-8">
              <Link
                href="/tools"
                className="text-sm font-medium text-foreground underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
              >
                Browse all tools →
              </Link>
            </div>
          </>
        ) : (
          <HomepageEmptyState />
        )}
      </Container>

      {/* ── Recently Added ── */}
      {recent.length > 0 && (
        <section aria-labelledby="recently-added-heading" className="border-t border-border">
          <Container className="py-12 sm:py-16">

            {/* Section header */}
            <div className="mb-8 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2
                  id="recently-added-heading"
                  className="text-base font-medium tracking-tight text-foreground"
                >
                  Recently Added
                </h2>
                <p className="text-sm text-muted-foreground">
                  New tools added to StackHub
                </p>
              </div>
              <Link
                href="/tools"
                className="shrink-0 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                View all →
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((tool) => (
                <ToolCard key={tool.id} tool={tool} isNew />
              ))}
            </div>

          </Container>
        </section>
      )}

      {/* ── Skeleton preview when DB is empty (no content at all) ── */}
      {!hasContent && (
        <section className="border-t border-border">
          <Container className="py-12 sm:py-16">
            <div className="mb-8">
              <h2 className="text-base font-medium tracking-tight text-foreground">
                Recently Added
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

// ── Homepage empty state ───────────────────────────────────────────────────

function HomepageEmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-dashed border-border bg-background py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
        <InboxIcon />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          No featured tools yet
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          The catalog is being built. Browse all available tools or submit one
          to get started.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/tools"
          className="inline-flex h-9 items-center rounded-lg border border-foreground bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-80"
        >
          Browse all tools
        </Link>
        <Link
          href="/submit"
          className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-[#CCCCCC] hover:bg-secondary"
        >
          Submit a tool
        </Link>
      </div>
    </div>
  );
}

function InboxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
      aria-hidden="true"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
