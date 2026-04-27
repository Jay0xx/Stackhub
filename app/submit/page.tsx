import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/container";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit a Tool",
  description:
    "Help grow StackHub by submitting a new Web3 developer tool, library, or infrastructure project to the catalog.",
  alternates: { canonical: "/submit" },
  openGraph: {
    title: "Submit a Tool | StackHub",
    description:
      "Help grow StackHub by submitting a new Web3 developer tool to the catalog.",
    url: "/submit",
  },
  twitter: {
    title: "Submit a Tool | StackHub",
    description:
      "Help grow StackHub by submitting a new Web3 developer tool to the catalog.",
  },
};

export default function SubmitPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="border-b border-border">
        <Container className="py-12 sm:py-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeftIcon />
            Back to Discover
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Submit a New Tool
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              Help grow StackHub by adding a new Web3 developer tool to the
              catalog.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Form + sidebar ── */}
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">

          {/* Form — left column */}
          <div className="min-w-0">
            <SubmitForm />
          </div>

          {/* Guidelines — right sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <GuidelineCard
              title="Submission guidelines"
              items={[
                "Tool must be publicly available",
                "GitHub repository is required",
                "Description should be clear and factual",
                "Duplicate submissions will be merged",
                "Review takes 1–3 business days",
              ]}
            />
            <GuidelineCard
              title="What makes a good listing?"
              items={[
                "Actively maintained (commits in last 6 months)",
                "Useful to Web3 developers specifically",
                "Has documentation or a readme",
                "Open source preferred, but not required",
              ]}
            />
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ─── Sidebar card ────────────────────────────────────────────────────────── */

function GuidelineCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <span className="mt-[3px] shrink-0 text-muted-foreground" aria-hidden="true">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Icon ────────────────────────────────────────────────────────────────── */

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
