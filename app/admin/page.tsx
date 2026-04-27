import type { Metadata } from "next";
import { Container } from "@/components/container";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  // Hard noindex — never let search engines crawl or index the admin page.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminPage() {
  return (
    <>
      {/* ── Header ── */}
      <div className="border-b border-border">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <span className="inline-flex items-center rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              stackhub
            </span>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Approve or reject submitted tools before they appear publicly.
          </p>
        </Container>
      </div>

      {/* ── Content ── */}
      <Container className="py-10">
        <AdminDashboard />
      </Container>
    </>
  );
}
