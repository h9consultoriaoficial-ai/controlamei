import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/lib/types";

/**
 * Retorna o usuário logado e o tenant (MEI) dele.
 * Usa getUser() (valida o JWT). Redireciona se não houver sessão/tenant.
 */
export async function getTenantOrRedirect(): Promise<{
  userId: string;
  tenant: Tenant;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!tenant) {
    // Usuário autenticado mas sem cadastro de MEI completo.
    redirect("/cadastro?incompleto=1");
  }

  return { userId: user.id, tenant: tenant as Tenant };
}
