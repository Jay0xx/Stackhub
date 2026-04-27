import Link from "next/link";
import { Container } from "@/components/container";

const GITHUB_URL = "https://github.com/yourusername/stackhub";
const TWITTER_URL = "https://twitter.com/stackhub";

const NAV_LINKS = [
  { href: "/about",   label: "About" },
  { href: "/tools",   label: "Tools" },
  { href: "/templates", label: "Templates" },
  { href: "/submit",  label: "Submit a Tool" },
  { href: GITHUB_URL, label: "GitHub", external: true },
  { href: TWITTER_URL, label: "Twitter / X", external: true },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-background">
      <Container className="py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Left — brand + copyright + tagline */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium tracking-tight text-foreground">
              StackHub
            </span>
            <span className="text-xs text-muted-foreground">
              © {year} StackHub. All rights reserved.
            </span>
            <span className="text-xs text-muted-foreground/70">
              Built for Web3 developers. Open source.
            </span>
          </div>

          {/* Right — nav links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>
      </Container>
    </footer>
  );
}
