import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when real credentials are present at runtime. */
export const supabaseConfigured = Boolean(url && key);

/**
 * Lazy singleton Supabase client.
 *
 * We defer createClient() until the first actual query so that importing
 * this module during the Next.js build phase (e.g. for sitemap.xml) does
 * NOT throw "supabaseUrl is required" when env vars aren't set.
 *
 * Every helper in lib/data.ts calls supabase.from(...) — that goes through
 * this proxy, which either returns the real client or a no-op stub whose
 * every method returns { data: null, error: { message: "Supabase not configured" } }.
 */
let _client: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (_client) return _client;

  if (!url || !key) {
    // Return a stub that makes every query fail gracefully so callers can
    // fall through to their static fallbacks without throwing.
    return createNoopClient() as unknown as SupabaseClient<Database>;
  }

  _client = createClient<Database>(url, key);
  return _client;
}

// Proxy so existing code can keep writing `supabase.from(...)` unchanged.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ── No-op stub ────────────────────────────────────────────────────────────

type StubResult = { data: null; error: { message: string } };

function stubResult(): StubResult {
  return { data: null, error: { message: "Supabase not configured" } };
}

/** Minimal chainable stub that always resolves to an error result. */
function createNoopClient() {
  const terminal = new Proxy(
    {},
    {
      get() {
        return () => terminal;
      },
      // When awaited, resolve to the error stub.
      // This works because Promise.resolve() checks for .then()
    },
  );

  // Make the chain thenable so `await supabase.from("x").select("*")` works.
  const chain: Record<string, unknown> = {};
  const chainHandler: ProxyHandler<Record<string, unknown>> = {
    get(_t, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") {
        // Thenables — resolve immediately with the error stub
        return (
          resolve?: (v: StubResult) => void,
          _reject?: (e: unknown) => void,
        ) => {
          const result = stubResult();
          return Promise.resolve(resolve ? resolve(result) : result);
        };
      }
      // Every other method returns the same chainable proxy
      return () => new Proxy(chain, chainHandler);
    },
  };

  return {
    from: () => new Proxy(chain, chainHandler),
    auth: { getUser: async () => stubResult() },
  };
}
