import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com SERVICE ROLE — faz BYPASS de RLS.
 * USAR SOMENTE NO SERVIDOR e em caminhos controlados:
 *  - criar usuário + tenant no cadastro;
 *  - ler o relatório público (/r/[token]) escopado pelo token.
 *
 * NUNCA importar em client components. Sempre escopar a query
 * (por user_id ou por token) — o RLS não protege quando se usa
 * a service role.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. Defina no painel da Vercel."
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
