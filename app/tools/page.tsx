import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/container";
import { ToolBrowser } from "@/components/tool-browser";
import { getAllTools } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse the complete collection of Web3 developer tools, libraries, and infrastructure. Search, filter by category, and sort by stars or recency.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "All Tools | StackHub",
    description:
      "Browse the complete collection of Web3 developer tools, libraries, and infrastructure.",
    url: "/tools",
  },
  twitter: {
    title: "All Tools | StackHub",
    description:
      "Browse the complete collection of Web3 developer tools, libraries, and infrastructure.",
  },
};

export default async function BrowseToolsPage() {
  // getAllTools() returns [] on any Supabase error — never throws.
  const tools = await getAllTools();

  return (
    <>
      {/* ── Page header ── */}
      <section className="border-b border-border">
        <Container className="py-12 sm:py-16">

          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeftIcon />
            Back to Discover
          </Link>

          {/* Title block */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                All Tools
              </h1>
              <p className="max-w-xl text-base text-muted-foreground">
                Browse the complete collection of Web3 developer tools and
                documentation.
              </p>
            </div>

            {/* Catalog count chip — only shown when we have results */}
            {tools.length > 0 && (
              <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                {tools.length} tools
              </span>
            )}
          </div>
        </Container>
      </section>

      {/* ── Search + filters + grid ── */}
      <Container className="py-12 sm:py-16">
        <ToolBrowser
          tools={tools}
          sectionHeading="All Tools"
          sectionId="all-tools-heading"
          showCounts
          error={
            tools.length === 0
              ? "Failed to load tools. Please check your connection and try again."
              : null
          }
        />
      </Container>
    </>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
