import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { TemplateBrowser } from "@/components/template-browser";

export const metadata: Metadata = {
  title: "Templates & Starters",
  description:
    "Production-ready Web3 templates and starters. Deploy a full-stack dApp, Solana program, or smart contract project in minutes.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Templates & Starters | StackHub",
    description:
      "Production-ready Web3 templates and starters. Deploy a full-stack dApp, Solana program, or smart contract project in minutes.",
    url: "/templates",
  },
  twitter: {
    title: "Templates & Starters | StackHub",
    description:
      "Production-ready Web3 templates and starters for dApps, smart contracts, and more.",
  },
};

export default function TemplatesPage() {
  return (
    <>
      {/* ── Page header ── */}
      <Container className="pt-14 pb-10">
        <div className="flex flex-col gap-4 max-w-2xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Discover
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Templates</span>
          </nav>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Templates &amp; Starters
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
              Production-ready starting points for Web3 projects. Pick a
              template, deploy in one click, and ship faster.
            </p>
          </div>
        </div>
      </Container>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Browser (client island) ── */}
      <Container className="py-10">
        <TemplateBrowser />
      </Container>

      {/* ── Bottom CTA ── */}
      <div className="border-t border-border">
        <Container className="py-10">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Have a template to share?
            </p>
            <p className="text-sm text-muted-foreground">
              Submit it via the{" "}
              <Link
                href="/submit"
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Submit Tool
              </Link>{" "}
              form and we will review it.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
