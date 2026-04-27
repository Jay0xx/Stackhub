/**
 * lib/github.ts
 * ------------
 * Fetch live GitHub star counts with a 5-minute in-memory cache.
 *
 * Why in-memory and not localStorage / SWR?
 *  - Works in both client components and server-side code (no window dep)
 *  - Zero dependencies
 *  - Tab-scoped: cache busts naturally on hard refresh
 *  - 5-min TTL is short enough to feel live, long enough to not hammer the API
 *
 * GitHub unauthenticated rate limit: 60 req/hour per IP.
 * With 5-min caching and ~16 tools visible at once, worst case is 16 req
 * per 5 minutes = well inside the limit.
 */

interface CacheEntry {
  count: number;
  expiresAt: number; // Date.now() ms
}

// Module-level cache — shared across all hook instances in the same tab.
const cache = new Map<string, CacheEntry>();

const TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Parse a GitHub repo URL into "owner/repo" or null.
 * Handles: https://github.com/owner/repo, https://github.com/owner/repo/tree/...
 */
export function parseGithubRepo(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("github.com")) return null;
    // pathname starts with "/" → ["", "owner", "repo", ...]
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

/**
 * Fetch the stargazers_count for a GitHub repo.
 * Returns null on any error (rate limit, network, bad URL).
 * Results are cached for TTL_MS.
 */
export async function fetchGithubStars(githubUrl: string): Promise<number | null> {
  const repo = parseGithubRepo(githubUrl);
  if (!repo) return null;

  // Cache hit
  const cached = cache.get(repo);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.count;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        // Optionally add Authorization header if GITHUB_TOKEN env var present
        ...(typeof process !== "undefined" && process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      // next.js fetch cache: revalidate every 5 min server-side too
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // 403 = rate limited, 404 = repo not found — both are silent fallbacks
      return null;
    }

    const json = await res.json() as { stargazers_count?: number };
    const count = json.stargazers_count ?? null;

    if (count !== null) {
      cache.set(repo, { count, expiresAt: Date.now() + TTL_MS });
    }

    return count;
  } catch {
    return null;
  }
}

/**
 * Format a raw star count into a compact human string.
 * 1000 → "1k", 25100 → "25.1k", 999 → "999"
 */
export function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
