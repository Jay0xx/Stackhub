import { useState, useEffect } from "react";
import { fetchGithubStars, formatStars } from "@/lib/github";

interface UseLiveStarsResult {
  /** Formatted star string, e.g. "8.9k". Falls back to the Supabase value. */
  display: string;
  /** True once a live count has been fetched successfully. */
  live: boolean;
  /** True while the fetch is in flight. */
  loading: boolean;
}

/**
 * Fetches live GitHub stars for a single repo URL.
 *
 * @param githubUrl  Full GitHub repo URL, e.g. "https://github.com/wevm/wagmi"
 * @param fallback   Pre-formatted fallback from Supabase, e.g. "6.1k" or "—"
 */
export function useLiveStars(
  githubUrl: string | undefined | null,
  fallback: string,
): UseLiveStarsResult {
  const [display, setDisplay] = useState(fallback);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!githubUrl) return;

    let cancelled = false;
    setLoading(true);

    fetchGithubStars(githubUrl).then((count) => {
      if (cancelled) return;
      setLoading(false);
      if (count !== null) {
        setDisplay(formatStars(count));
        setLive(true);
      }
      // On null (rate limit / error) we silently keep the fallback
    });

    return () => { cancelled = true; };
  }, [githubUrl]);

  return { display, live, loading };
}
