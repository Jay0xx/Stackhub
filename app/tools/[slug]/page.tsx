import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { CodeBlock } from "@/components/code-block";
import { OfficialLinks } from "@/components/official-links";
import { ToolCard } from "@/components/tool-card";
import { LiveStarBadge } from "@/components/live-star-badge";
import {
  getAllSlugs,
  getRelatedTools,
  getToolBySlug,
  getToolStatus,
} from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };

  const title = tool.name;
  const description = tool.description;
  const url = `/tools/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | StackHub`,
      description,
      url,
      // Inherits og-default.svg from root layout until per-tool OG images exist.
    },
    twitter: {
      title: `${tool.name} | StackHub`,
      description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  // Tool not in DB at all — hard 404
  if (!tool) notFound();

  // Tool exists but is pending — show under-review message
  if ((await getToolStatus(slug)) === "pending") {
    return <UnderReview slug={slug} />;
  }

  const related = await getRelatedTools(tool.relatedSlugs ?? [], 4);
  const chips = [tool.category, ...(tool.tags ?? [])];

  return (
    <>
      {/* Breadcrumb */}
      <Container className="pt-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Discover
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tools"
            className="transition-colors hover:text-foreground"
          >
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{tool.name}</span>
        </nav>
      </Container>

      {/* 1. Header */}
      <Container as="header" className="pt-10 pb-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-6">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {tool.name}
              </h1>
              <LiveStarBadge
                fallback={tool.stars}
                githubUrl={tool.links?.github}
                variant="detail"
              />
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {chips.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* 2. Official Links */}
      {tool.links && (
        <Container className="pb-14">
          <SectionLabel>Official links</SectionLabel>
          <OfficialLinks links={tool.links} className="mt-4" />
        </Container>
      )}

      {/* 3. Description */}
      {tool.longDescription && (
        <Container className="pb-16">
          <SectionHeading>About {tool.name}</SectionHeading>
          <div className="mt-6 max-w-3xl">
            <p className="text-base leading-relaxed text-foreground/90">
              {tool.longDescription}
            </p>
          </div>
        </Container>
      )}

      {/* 4. Quickstarts */}
      {tool.quickstarts && tool.quickstarts.length > 0 && (
        <Container className="pb-16">
          <SectionHeading>Quickstarts</SectionHeading>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A fast path from zero to running code.
          </p>
          <div className="mt-6 flex flex-col gap-5">
            {tool.quickstarts.map((qs, i) => (
              <CodeBlock
                key={`${tool.slug}-qs-${i}`}
                title={qs.title}
                language={qs.language}
                code={qs.code}
              />
            ))}
          </div>
        </Container>
      )}

      {/* 5. Documentation */}
      {(tool.docsSummary || tool.docsUrl || tool.links?.docs) && (
        <Container className="pb-16">
          <SectionHeading>Documentation</SectionHeading>
          <div className="mt-6 max-w-3xl rounded-lg border border-border bg-card p-6">
            {tool.docsSummary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tool.docsSummary}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Official documentation for {tool.name}.
              </p>
            )}
            {(tool.docsUrl || tool.links?.docs) && (
              <a
                href={tool.docsUrl ?? tool.links?.docs ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Read full docs
                <ArrowIcon />
              </a>
            )}
          </div>
        </Container>
      )}

      {/* 6. Community Notes */}
      <Container className="pb-16">
        <div className="flex items-baseline justify-between gap-4">
          <SectionHeading>Community Notes</SectionHeading>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground opacity-70"
          >
            Add note
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {(tool.communityNotes ?? PLACEHOLDER_NOTES).map((note, i) => (
            <article
              key={`${tool.slug}-note-${i}`}
              className="rounded-lg border border-border bg-card p-5"
            >
              <header className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-foreground">
                  {note.author}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {note.timeAgo}
                </span>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {note.body}
              </p>
            </article>
          ))}
        </div>
      </Container>

      {/* 7. Related Tools */}
      {related.length > 0 && (
        <Container className="pb-24">
          <div className="flex items-baseline justify-between gap-4">
            <SectionHeading>Related Tools</SectionHeading>
            <Link
              href="/"
              className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              Browse all →
            </Link>
          </div>

          {/* Horizontal scroll on narrow screens, grid on wider viewports */}
          <div className="mt-6 -mx-6 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col gap-4 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <li key={t.id} className="h-full">
                  <ToolCard tool={t} compact />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      )}
    </>
  );
}

/* ---------- Local building blocks ---------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
      {children}
    </h2>
  );
}

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

/** Fallback notes for tools that don't yet have community content. */
const PLACEHOLDER_NOTES: {
  author: string;
  timeAgo: string;
  body: string;
}[] = [
  {
    author: "@stackhub",
    timeAgo: "just now",
    body: "Community notes will appear here once the first contributor drops one. Submissions are open to anyone with a connected wallet.",
  },
  {
    author: "@stackhub",
    timeAgo: "just now",
    body: "Have a tip, gotcha, or production story worth sharing? Help the next developer save an afternoon.",
  },
];

/* ── Under Review page ──────────────────────────────────────────────────── */

function UnderReview({ slug }: { slug: string }) {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md text-center flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Under Review
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">
              {slug}
            </span>{" "}
            has been submitted and is awaiting approval. It will appear on
            StackHub once a moderator has reviewed it.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Link
            href="/tools"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Browse approved tools
          </Link>
          <span className="text-border" aria-hidden="true">·</span>
          <Link
            href="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </Container>
  );
}
