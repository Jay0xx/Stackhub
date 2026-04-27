import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Singleton Supabase client.
 * Safe to import from both server components and client components
 * because we only use the public anon key.
 *
 * When env vars are missing (e.g. during CI / build with no .env.local)
 * the client is created with empty strings — all queries will fail and
 * fall through to the static fallbacks in lib/data.ts.
 */
export const supabase = createClient<Database>(url, key);

/** True only when real credentials are present at runtime. */
export const supabaseConfigured = Boolean(url && key);
