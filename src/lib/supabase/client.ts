import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (client components).
 * Usa a anon key pública. O isolamento é garantido pelo RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
