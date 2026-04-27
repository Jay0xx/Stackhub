import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackhub.dev";

/**
 * app/sitemap.ts
 * ──────────────
 * Generates a sitemap.xml at /sitemap.xml automatically via Next.js.
 * Includes:
 *  - All static public routes
 *  - All approved tool detail pages (dynamic, fetched from Supabase)
 *
 * The admin page is intentionally excluded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static routes ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/roadmaps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // ── Dynamic tool pages ─────────────────────────────────────────────────
  // getAllSlugs() already filters for approved tools only.
  let toolSlugs: string[] = [];
  try {
    toolSlugs = await getAllSlugs();
  } catch {
    // Silently fall back to static routes if Supabase is unreachable at
    // sitemap generation time (e.g. during a CI build without env vars).
  }

  const toolRoutes: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
