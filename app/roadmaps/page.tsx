import type { Metadata } from "next";
import { Container } from "@/components/container";
import { RoadmapBrowser } from "@/components/roadmap-browser";

export const metadata: Metadata = {
  title: "Learning Roadmaps",
  description:
    "Curated step-by-step paths to become proficient with Web3 developer tools. From beginner dApp development to advanced smart contract security.",
  alternates: { canonical: "/roadmaps" },
  openGraph: {
    title: "Learning Roadmaps | StackHub",
    description:
      "Curated paths to become proficient with Web3 developer tools — from beginner to advanced.",
    url: "/roadmaps",
  },
  twitter: {
    title: "Learning Roadmaps | StackHub",
    description:
      "Curated paths to become proficient with Web3 developer tools.",
  },
};

export default function RoadmapsPage() {
  return (
    <>
      {/* ── Page header ── */}
      <section className="border-b border-border">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Learning paths
              </p>
              <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                Roadmaps
              </h1>
              <p className="mt-1 max-w-xl text-base text-muted-foreground">
                Curated paths to become proficient with Web3 developer tools.
                Each roadmap walks you through the right tools in the right
                order.
              </p>
            </div>

            {/* Count chip */}
            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              6 roadmaps
            </span>
          </div>
        </Container>
      </section>

      {/* ── Difficulty legend ── */}
      <Container className="pt-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-xs text-muted-foreground">Difficulty:</span>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => (
            <span key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DifficultyDot level={level} />
              {level}
            </span>
          ))}
        </div>
      </Container>

      {/* ── Grid ── */}
      <Container className="py-10 pb-24">
        <RoadmapBrowser />
      </Container>
    </>
  );
}

/* Tiny dot legend — mirrors the pill colours without importing the full client component */
function DifficultyDot({ level }: { level: "Beginner" | "Intermediate" | "Advanced" }) {
  const colours = {
    Beginner:     "bg-secondary border-border",
    Intermediate: "bg-[#111111] border-[#333333]",
    Advanced:     "bg-foreground border-foreground",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full border ${colours[level]}`}
      aria-hidden="true"
    />
  );
}
