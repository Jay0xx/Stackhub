/**
 * Shared domain types for StackHub.
 */

export const CATEGORIES = [
  "All",
  "Smart Contracts",
  "Frontend",
  "Backend & Indexing",
  "Infrastructure",
  "Security",
  "Testing & Deployment",
  "Templates",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Every real category except the "All" sentinel. */
export type ToolCategory = Exclude<Category, "All">;

export interface ToolLinks {
  github?: string;
  docs?: string;
  npm?: string;
  website?: string;
}

export interface Quickstart {
  title: string;
  language: "bash" | "ts" | "tsx" | "js" | "sol" | "json" | "text";
  code: string;
}

export interface CommunityNote {
  author: string;
  /** Human timeframe, e.g. "2 weeks ago". Keep it static for now. */
  timeAgo: string;
  body: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ToolCategory;
  /** Optional secondary tags/categories for the header chips row. */
  tags?: string[];
  /** Human-formatted star count, e.g. "124.3k" or "8.2k". */
  stars: string;
  /** Raw integer star count — used for numeric sort. Defaults to 0 when unavailable. */
  starsRaw: number;
  /** ISO timestamp from created_at — used for "Recently Added" sort. */
  createdAt: string;

  links?: ToolLinks;

  quickstarts?: Quickstart[];
  docsSummary?: string;
  docsUrl?: string;

  communityNotes?: CommunityNote[];

  /** Slugs of related tools rendered in the Related section. */
  relatedSlugs?: string[];
}

/**
 * Subset used for static fallback data in data/tools.ts.
 * starsRaw / createdAt are optional here — rowToTool() fills them from the DB.
 */
export type StaticToolData = Omit<Tool, "starsRaw" | "createdAt"> & {
  starsRaw?: number;
  createdAt?: string;
};

export interface DocSource {
  id: string;
  toolId: string;
  title: string;
  url: string;
  kind: "guide" | "reference" | "tutorial" | "example";
}
