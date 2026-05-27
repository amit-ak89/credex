import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export function getSupabaseAdmin() {
  return createClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// Lazy singleton
let _admin: ReturnType<typeof createClient> | null = null;
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (!_admin) _admin = getSupabaseAdmin();
    return (_admin as Record<string | symbol, unknown>)[prop];
  },
});
