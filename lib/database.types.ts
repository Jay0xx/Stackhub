/**
 * Hand-written database types for StackHub.
 * Run `npx supabase gen types typescript` once you have the CLI set up
 * to auto-generate these from your live schema instead.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ToolStatus = "pending" | "approved";

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          category: string;
          github_stars: number | null;
          github_url: string | null;
          docs_url: string | null;
          npm_url: string | null;
          website_url: string | null;
          tags: string[] | null;
          related_slugs: string[] | null;
          featured: boolean;
          status: ToolStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tools"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
          status?: ToolStatus;
        };
        Update: Partial<Database["public"]["Tables"]["tools"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

/** Convenience alias for a single row. */
export type ToolRow = Database["public"]["Tables"]["tools"]["Row"];

// ── community_notes ────────────────────────────────────────────────────────

export interface CommunityNoteRow {
  id: string;
  tool_slug: string;
  author_name: string | null;
  note: string;
  created_at: string;
}
