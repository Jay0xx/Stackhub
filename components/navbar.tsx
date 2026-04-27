"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* ── Navigation map ──────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/tools",     label: "Tools" },
  { href: "/templates", label: "Templates" },
  { href: "/roadmaps",  label: "Roadmaps" },
  { href: "/about",     label: "About" },
] as const;

/* ── Navbar ──────────────────────────────────────────────────────────────── */

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change (link click navigates, pathname updates)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  // Lock body scroll + attach Escape listener while menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onKeyDown]);

  return (
    <>
      {/* ── Sticky header bar ── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">

          {/* Left: logo + desktop nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-[15px] font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
            >
              StackHub
            </Link>

            {/* Desktop nav — hidden below md */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    pathname === href
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: desktop actions + hamburger */}
          <div className="flex items-center gap-3">
            {/* Admin — desktop only */}
            <Link
              href="/admin"
              className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground md:block"
              aria-label="Admin dashboard"
            >
              Admin
            </Link>

            {/* Submit Tool — desktop only */}
            <Link
              href="/submit"
              className="hidden h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
            >
              Submit Tool
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[#CCCCCC] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {/*
        Rendered in the DOM always so the CSS transition runs on both open
        and close. `aria-hidden` hides it from assistive tech when closed.
        `pointer-events-none` prevents clicks from hitting the invisible panel.
      */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          // Base: fixed below the 64px header, full screen
          "fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col",
          // Hide above md
          "md:hidden",
          // Transition
          "transition-all duration-200 ease-in-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Dimmed backdrop — click to close */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-down panel */}
        <nav
          aria-label="Mobile navigation"
          className={cn(
            "relative flex flex-col gap-0 border-b border-border bg-background",
            "transition-transform duration-200 ease-in-out",
            open ? "translate-y-0" : "-translate-y-3",
          )}
        >
          {/* Primary links */}
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center border-b border-border px-6 py-4 text-sm transition-colors hover:bg-secondary",
                pathname === href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}

          {/* Divider + secondary actions */}
          <div className="flex items-center gap-3 px-6 py-4">
            <Link
              href="/submit"
              className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Submit Tool
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-[#CCCCCC] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Admin
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

function HamburgerIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
