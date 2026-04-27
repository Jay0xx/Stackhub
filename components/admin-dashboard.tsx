"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  adminGetAllTools,
  adminApproveTool,
  adminDeleteTool,
} from "@/lib/data";

/* ── Types ───────────────────────────────────────────────────────────────── */

type AdminTool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  github_url: string | null;
  created_at: string;
};

/* ── Constants ───────────────────────────────────────────────────────────── */

const ADMIN_PASSWORD = "Zandar700$$$";
const SESSION_KEY = "sh_admin_authed";

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Root export                                                               */
/* ══════════════════════════════════════════════════════════════════════════ */

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);

  // Persist auth in sessionStorage so a page-refresh doesn't re-prompt.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <PasswordGate
        onSuccess={() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setAuthed(true);
        }}
      />
    );
  }

  return <Dashboard />;
}

/* ── Password gate ───────────────────────────────────────────────────────── */

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function attempt(e: React.FormEvent) {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      setValue("");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={attempt}
        className={cn(
          "flex flex-col gap-5 w-full max-w-xs",
          shaking && "animate-shake",
        )}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            Admin access
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter the admin password to continue.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={cn(
              "h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-foreground",
              error ? "border-foreground ring-1 ring-foreground/20" : "border-border",
            )}
          />
          {error && (
            <p className="text-xs text-foreground flex items-center gap-1.5">
              <AlertIcon /> Incorrect password.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="h-10 w-full rounded-lg bg-foreground text-background text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          Unlock
        </button>
      </form>

      {/* Shake keyframe injected inline — avoids Tailwind plugin dependency */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}

/* ── Main dashboard ──────────────────────────────────────────────────────── */

function Dashboard() {
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await adminGetAllTools();
    if (error) {
      setFetchError(error);
    } else {
      setTools(data);
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const pending  = tools.filter((t) => t.status === "pending");
  const approved = tools.filter((t) => t.status === "approved");

  function handleApprove(id: string) {
    setActionError(null);
    startTransition(async () => {
      const { error } = await adminApproveTool(id);
      if (error) { setActionError(error); return; }
      setTools((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t)),
      );
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionError(null);
    startTransition(async () => {
      const { error } = await adminDeleteTool(id);
      if (error) { setActionError(error); return; }
      setTools((prev) => prev.filter((t) => t.id !== id));
    });
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-lg border border-dashed border-border bg-background py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
          <AlertIcon />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">
            Failed to load tools
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {fetchError}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex h-8 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-[#CCCCCC] hover:bg-secondary"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">

      {/* ── Global action error ── */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-xs text-foreground">
          <AlertIcon />
          {actionError}
          <button
            onClick={() => setActionError(null)}
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Pending section                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="pending-heading">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <h2
              id="pending-heading"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Pending Review
            </h2>
            <CountBadge count={pending.length} />
          </div>
          <button
            onClick={load}
            disabled={isPending}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-40"
          >
            Refresh
          </button>
        </div>

        {pending.length === 0 ? (
          <EmptyState message="No tools awaiting review." />
        ) : (
          <ToolTable
            tools={pending}
            variant="pending"
            onApprove={handleApprove}
            onDelete={handleDelete}
            busy={isPending}
          />
        )}
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Approved section                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="approved-heading">
        <div className="flex items-center gap-3 mb-5">
          <h2
            id="approved-heading"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Approved &amp; Live
          </h2>
          <CountBadge count={approved.length} />
        </div>

        {approved.length === 0 ? (
          <EmptyState message="No approved tools yet." />
        ) : (
          <ToolTable
            tools={approved}
            variant="approved"
            onApprove={handleApprove}
            onDelete={handleDelete}
            busy={isPending}
          />
        )}
      </section>
    </div>
  );
}

/* ── Dashboard skeleton ───────────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      {/* Pending section skeleton */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
            <div className="h-5 w-6 animate-pulse rounded-full bg-secondary" />
          </div>
          <div className="h-3 w-12 animate-pulse rounded bg-secondary" />
        </div>
        <TableSkeleton rows={3} />
      </section>

      <div className="border-t border-border" />

      {/* Approved section skeleton */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
          <div className="h-5 w-6 animate-pulse rounded-full bg-secondary" />
        </div>
        <TableSkeleton rows={5} />
      </section>
    </div>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            {["Name", "Category", "Description", "Submitted", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
                  <div className="h-2.5 w-20 animate-pulse rounded bg-secondary" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
              </td>
              <td className="hidden md:table-cell px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
                </div>
              </td>
              <td className="hidden lg:table-cell px-4 py-3">
                <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-7 w-16 animate-pulse rounded bg-secondary" />
                  <div className="h-7 w-14 animate-pulse rounded bg-secondary" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Tool table ──────────────────────────────────────────────────────────── */

function ToolTable({
  tools,
  variant,
  onApprove,
  onDelete,
  busy,
}: {
  tools: AdminTool[];
  variant: "pending" | "approved";
  onApprove: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  busy: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            <Th>Name</Th>
            <Th>Category</Th>
            <Th className="hidden md:table-cell">Description</Th>
            <Th className="hidden lg:table-cell">Submitted</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, i) => (
            <tr
              key={tool.id}
              className={cn(
                "border-b border-border last:border-0 transition-colors hover:bg-secondary/50",
                i % 2 === 0 ? "bg-background" : "bg-secondary/20",
              )}
            >
              {/* Name + slug */}
              <td className="px-4 py-3 align-top">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground leading-snug">
                    {tool.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {tool.slug}
                  </span>
                  {tool.github_url && (
                    <Link
                      href={tool.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors truncate max-w-[140px]"
                    >
                      GitHub ↗
                    </Link>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-3 align-top">
                <CategoryPill label={tool.category} />
              </td>

              {/* Description */}
              <td className="hidden md:table-cell px-4 py-3 align-top max-w-xs">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </td>

              {/* Submitted date */}
              <td className="hidden lg:table-cell px-4 py-3 align-top text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(tool.created_at)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 align-top">
                <div className="flex items-center justify-end gap-2">
                  {variant === "pending" && (
                    <ActionButton
                      onClick={() => onApprove(tool.id)}
                      disabled={busy}
                      variant="approve"
                    >
                      Approve
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={() => onDelete(tool.id, tool.name)}
                    disabled={busy}
                    variant="delete"
                  >
                    {variant === "pending" ? "Reject" : "Delete"}
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "approve" | "delete";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center rounded px-2.5 text-[11px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "approve"
          ? "border border-[#333333] bg-[#111111] text-white hover:bg-foreground"
          : "border border-border bg-background text-muted-foreground hover:border-[#999999] hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
      {label}
    </span>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary border border-border px-1.5 text-[10px] font-mono font-medium text-muted-foreground">
      {count}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/30 py-10 text-center">
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

/* ── Utils ───────────────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
