import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn what StackHub is, why we built it, and how you can contribute to the open-source Web3 developer tools catalog.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | StackHub",
    description:
      "Learn what StackHub is, why we built it, and how you can contribute.",
    url: "/about",
  },
};

const GITHUB_URL = "https://github.com/yourusername/stackhub";
const GITHUB_ISSUES_URL = "https://github.com/yourusername/stackhub/issues";
const GITHUB_CONTRIBUTING_URL =
  "https://github.com/yourusername/stackhub/blob/main/CONTRIBUTING.md";
const TWITTER_URL = "https://twitter.com/stackhub";

export default function AboutPage() {
  return (
    <>
      {/* ── Page header ── */}
      <section className="border-b border-border">
        <Container className="py-14 sm:py-20">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              About
            </p>
            <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              About StackHub
            </h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
              A curated, open-source catalog of tools, libraries, and
              infrastructure for Web3 developers — maintained by the community.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Body ── */}
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <Prose>

            {/* 1 */}
            <Section title="What is StackHub?">
              <p>
                StackHub is a central directory for Web3 developer tools.
                It covers the full stack — smart contract frameworks, frontend
                wallet libraries, indexing protocols, RPC providers, security
                tools, and more.
              </p>
              <p>
                Every entry in the catalog includes a description, category
                tags, GitHub star count (fetched live), official links, and
                quickstart code snippets so you can go from zero to running
                code in minutes rather than hours of documentation archaeology.
              </p>
            </Section>

            {/* 2 */}
            <Section title="Why we built it">
              <p>
                The Web3 tooling landscape moves fast. New frameworks appear
                weekly, projects get abandoned, and the best resources are
                scattered across GitHub READMEs, Discord servers, and blog
                posts from two years ago.
              </p>
              <p>
                We wanted a single, clean place to answer the question:{" "}
                <em>what should I actually use for this?</em> — with honest
                star counts, real descriptions, and no vendor fluff.
              </p>
            </Section>

            {/* 3 */}
            <Section title="How it works">
              <p>
                The catalog is backed by a Supabase database. Any developer
                can submit a tool via the{" "}
                <InlineLink href="/submit">Submit a Tool</InlineLink> page.
                Submissions land in a pending queue and go live once a
                moderator approves them.
              </p>
              <p>
                GitHub star counts are fetched live from the GitHub API on
                page load and cached in memory for five minutes — so the
                numbers stay current without hammering the API.
              </p>
              <p>
                The site is built with Next.js 16, Tailwind CSS, and
                shadcn/ui. It is statically generated at build time and
                revalidated as new tools are approved.
              </p>
            </Section>

            {/* 4 */}
            <Section title="Open source & community">
              <p>
                StackHub is fully open source under the MIT license. The
                source code lives on{" "}
                <InlineLink href={GITHUB_URL} external>GitHub</InlineLink>.
                Pull requests, issue reports, and tool submissions are all
                welcome.
              </p>
              <p>
                The goal is a catalog maintained by the developers who use
                these tools every day — not a marketing directory funded by
                the projects listed in it.
              </p>
              <ul>
                <li>
                  <InlineLink href={GITHUB_URL} external>
                    View the source on GitHub
                  </InlineLink>
                </li>
                <li>
                  <InlineLink href={GITHUB_CONTRIBUTING_URL} external>
                    Read the contributing guide
                  </InlineLink>
                </li>
                <li>
                  <InlineLink href={GITHUB_ISSUES_URL} external>
                    Report a bug or request a feature
                  </InlineLink>
                </li>
              </ul>
            </Section>

            {/* 5 */}
            <Section title="Contact & contribute">
              <p>
                The fastest way to contribute is to{" "}
                <InlineLink href="/submit">submit a missing tool</InlineLink>,
                open a GitHub issue, or send a pull request with an improvement
                to an existing entry.
              </p>
              <p>
                For anything else — partnership inquiries, press, or general
                feedback — reach out on{" "}
                <InlineLink href={TWITTER_URL} external>
                  Twitter / X
                </InlineLink>{" "}
                or open a{" "}
                <InlineLink href={GITHUB_ISSUES_URL} external>
                  GitHub discussion
                </InlineLink>
                .
              </p>
            </Section>

          </Prose>
        </div>
      </Container>
    </>
  );
}

/* ── Local building blocks ─────────────────────────────────────────────── */

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-14">{children}</div>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [&_em]:text-foreground [&_em]:not-italic [&_em]:font-medium [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-4 [&_li]:list-disc [&_li]:list-outside">
        {children}
      </div>
    </section>
  );
}

function InlineLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
    >
      {children}
    </Link>
  );
}
