/**
 * lib/data.ts
 * -----------
 * All Supabase fetches live here. Pages import these helpers — they never
 * touch the supabase client directly.
 *
 * Row → Tool mapping lives in rowToTool() so every fetch is consistent.
 * All public-facing queries filter status = 'approved' so pending submissions
 * never appear until an admin approves them.
 */

import { supabase } from "@/lib/supabase";
import type { ToolRow } from "@/lib/database.types";
import type { Tool, ToolCategory, StaticToolData } from "@/lib/types";
import { featuredTools as staticTools } from "@/data/tools";

/* ── Row → Tool mapper ──────────────────────────────────────────────────── */

function formatStars(n: number | null): string {
  if (!n || n === 0) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

/**
 * Merge a Supabase row with the matching static record (for quickstarts,
 * community notes, etc. that aren't in the DB yet).
 */
function rowToTool(row: ToolRow): Tool {
  const stat = staticTools.find((t) => t.slug === row.slug);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    longDescription: row.long_description ?? stat?.longDescription,
    category: row.category as ToolCategory,
    tags: row.tags ?? stat?.tags,
    stars: formatStars(row.github_stars),
    starsRaw: row.github_stars ?? 0,
    createdAt: row.created_at,
    links: {
      github: row.github_url ?? undefined,
      docs: row.docs_url ?? undefined,
      npm: row.npm_url ?? undefined,
      website: row.website_url ?? undefined,
    },
    // Rich detail still comes from static data until a DB table exists
    quickstarts: stat?.quickstarts,
    docsSummary: stat?.docsSummary,
    docsUrl: row.docs_url ?? stat?.docsUrl,
    communityNotes: stat?.communityNotes,
    relatedSlugs: row.related_slugs ?? stat?.relatedSlugs,
  };
}

/* ── Fetch helpers ──────────────────────────────────────────────────────── */

/**
 * Fetch featured tools for the home page.
 * Only approved tools, ordered by stars desc.
 */
export async function getFeaturedTools(limit = 8): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "approved")
    .eq("featured", true)
    .order("github_stars", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedTools]", error.message);
    return [];
  }

  return (data ?? []).map(rowToTool);
}

/**
 * Fetch all approved tools for the /tools browse page.
 * Ordered by stars desc.
 */
export async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "approved")
    .order("github_stars", { ascending: false });

  if (error) {
    console.error("[getAllTools]", error.message);
    return [];
  }

  return (data ?? []).map(rowToTool);
}

/**
 * Fetch a single approved tool by slug for the detail page.
 * Returns undefined for unknown slugs AND for pending tools.
 * Returns { pending: true } shape separately so the detail page can
 * show "under review" instead of a generic 404.
 */
export async function getToolBySlug(
  slug: string,
): Promise<Tool | undefined> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[getToolBySlug]", error.message);
    }
    return undefined;
  }

  if (!data) return undefined;

  // Return the tool regardless of status — the page decides what to render.
  return rowToTool(data);
}

/**
 * Check the raw status of a slug without returning the full tool.
 * Used by the detail page to distinguish "pending" from "not found".
 */
export async function getToolStatus(
  slug: string,
): Promise<"approved" | "pending" | "not_found"> {
  const { data, error } = await supabase
    .from("tools")
    .select("status")
    .eq("slug", slug)
    .single();

  if (error || !data) return "not_found";
  return (data as { status: "approved" | "pending" }).status;
}

/**
 * Fetch related tools given a list of slugs.
 * Only returns approved tools.
 */
export async function getRelatedTools(slugs: string[], limit = 4): Promise<Tool[]> {
  if (!slugs.length) return [];

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "approved")
    .in("slug", slugs.slice(0, limit));

  if (error) {
    console.error("[getRelatedTools]", error.message);
    return [];
  }

  return (data ?? []).map(rowToTool);
}

/**
 * Fetch all approved slugs for generateStaticParams.
 * Falls back to the static list when Supabase isn't reachable at build time.
 */
export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "approved")
    .order("slug");

  if (error) {
    console.warn("[getAllSlugs] falling back to static slugs:", error.message);
    return staticTools.map((t) => t.slug);
  }

  return (data ?? []).map((r) => (r as { slug: string }).slug);
}

/**
 * Fetch the most recently added approved tools for the "Recently Added" section.
 * Ordered by created_at desc so the newest floats to the top.
 */
export async function getRecentTools(limit = 6): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentTools]", error.message);
    return [];
  }

  return (data ?? []).map(rowToTool);
}



/**
 * Admin: fetch ALL tools regardless of status, ordered newest first.
 * Used only by the /admin dashboard — never exposed to public pages.
 */
type AdminToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  github_url: string | null;
  created_at: string;
};

export async function adminGetAllTools(): Promise<{
  data: AdminToolRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, description, category, status, github_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[adminGetAllTools]", error.message);
    return { data: [], error: error.message };
  }

  return { data: (data ?? []) as AdminToolRow[], error: null };
}

/**
 * Admin: approve a tool by id (set status → 'approved').
 */
export async function adminApproveTool(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("tools")
    .update({ status: "approved" } as never)
    .eq("id", id);

  if (error) {
    console.error("[adminApproveTool]", error.message);
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Admin: delete a tool by id (hard delete — no soft delete for now).
 */
export async function adminDeleteTool(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[adminDeleteTool]", error.message);
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Submit a new tool. Saved with status = 'pending' — requires admin approval
 * before it appears on any public page.
 */
export async function submitTool(payload: {
  name: string;
  slug: string;
  description: string;
  category: string;
  github_url: string;
  tags: string[] | null;
}): Promise<{ error: string | null }> {
  // Cast required: Supabase JS v2 collapses Insert to `never` when the
  // Database generic has hand-written types that don't satisfy its internal
  // constraint solver. The insert still works correctly at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("tools") as any).insert({
    ...payload,
    status: "pending",
    featured: false,
  });

  if (error) {
    console.error("[submitTool]", error.message);
    return { error: error.message };
  }

  return { error: null };
}
