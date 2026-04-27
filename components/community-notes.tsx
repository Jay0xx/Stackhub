"use client";

import { useState, useRef, useTransition } from "react";
import { cn } from "@/lib/utils";
import { postCommunityNote, type NoteItem } from "@/lib/data";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr  / 24);

  if (diffSec < 60)  return "just now";
  if (diffMin < 60)  return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr  < 24)  return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 7)   return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffDay < 30)  return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Types ──────────────────────────────────────────────────────────────────

interface CommunityNotesProps {
  toolSlug: string;
  initialNotes: NoteItem[];
}

// ── Component ──────────────────────────────────────────────────────────────

export function CommunityNotes({ toolSlug, initialNotes }: CommunityNotesProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [note, setNote]   = useState("");
  const [author, setAuthor] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function validate(): boolean {
    if (!note.trim()) {
      setNoteError("Note cannot be empty.");
      textareaRef.current?.focus();
      return false;
    }
    if (note.trim().length < 10) {
      setNoteError("Note must be at least 10 characters.");
      textareaRef.current?.focus();
      return false;
    }
    setNoteError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError(null);
    startTransition(async () => {
      const { data, error } = await postCommunityNote({
        tool_slug: toolSlug,
        note: note.trim(),
        author_name: author.trim() || null,
      });

      if (error || !data) {
        setSubmitError("Failed to post note. Please try again.");
        return;
      }

      // Optimistically prepend the new note
      setNotes((prev) => [data, ...prev]);
      setNote("");
      setAuthor("");
    });
  }

  return (
    <section aria-labelledby="community-notes-heading" className="flex flex-col gap-8">

      {/* ── Section header ── */}
      <div className="flex flex-col gap-1">
        <h2
          id="community-notes-heading"
          className="text-xl font-medium tracking-tight text-foreground sm:text-2xl"
        >
          Community Notes
        </h2>
        <p className="text-sm text-muted-foreground">
          Tips, gotchas, and updated examples from the community.
        </p>
      </div>

      {/* ── Notes list ── */}
      {notes.length === 0 ? (
        <EmptyNotes />
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </ul>
      )}

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Add note form ── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
        aria-label="Post a community note"
      >
        <h3 className="text-sm font-medium text-foreground">
          Share a note
        </h3>

        {/* Note textarea */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="community-note"
            className="text-xs font-medium text-muted-foreground"
          >
            Note <span className="text-foreground" aria-hidden="true">*</span>
          </label>
          <textarea
            ref={textareaRef}
            id="community-note"
            value={note}
            onChange={(e) => { setNote(e.target.value); if (noteError) setNoteError(null); }}
            placeholder="Share a tip, gotcha, or updated example..."
            rows={4}
            aria-required="true"
            aria-invalid={!!noteError}
            aria-describedby={noteError ? "note-error" : undefined}
            disabled={isPending}
            className={cn(
              "w-full resize-none rounded-lg border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors",
              "placeholder:text-muted-foreground/60",
              "focus:border-[#999999] focus:ring-0",
              "disabled:opacity-40",
              noteError ? "border-foreground" : "border-border",
            )}
          />
          {noteError && (
            <p
              id="note-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs text-foreground"
            >
              <AlertIcon />
              {noteError}
            </p>
          )}
        </div>

        {/* Author name (optional) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="community-author"
            className="text-xs font-medium text-muted-foreground"
          >
            Your name{" "}
            <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            id="community-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            maxLength={60}
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors",
              "placeholder:text-muted-foreground/60",
              "focus:border-[#999999]",
              "disabled:opacity-40",
            )}
          />
        </div>

        {/* Server error */}
        {submitError && (
          <p className="flex items-center gap-1.5 text-xs text-foreground" role="alert">
            <AlertIcon />
            {submitError}
          </p>
        )}

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "inline-flex h-9 items-center rounded-lg border border-border bg-foreground px-5 text-xs font-medium text-background",
              "transition-opacity hover:opacity-80",
              "disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
            )}
          >
            {isPending ? "Posting…" : "Post Note"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ── Note card ──────────────────────────────────────────────────────────────

function NoteCard({ note }: { note: NoteItem }) {
  return (
    <li>
      <article className="rounded-lg border border-border bg-card p-5">
        {/* Header row: author + date */}
        <header className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
              <UserIcon />
            </div>
            <span className="text-xs font-medium text-foreground">
              {note.author_name?.trim() || "Anonymous"}
            </span>
          </div>
          <time
            dateTime={note.created_at}
            className="text-[11px] tabular-nums text-muted-foreground shrink-0"
          >
            {formatDate(note.created_at)}
          </time>
        </header>

        {/* Note body */}
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {note.note}
        </p>
      </article>
    </li>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyNotes() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-background px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
        <ChatIcon />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          No community notes yet.
        </p>
        <p className="text-xs text-muted-foreground">
          Be the first to share a tip, gotcha, or updated example.
        </p>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="text-muted-foreground">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="text-muted-foreground">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}
