"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface LancarResult {
  ok: boolean;
  error?: string;
}

/**
 * Lança (ou atualiza) o faturamento de um mês.
 * Faz upsert em (tenant_id, mes, ano). RLS garante que só mexe no
 * tenant do próprio usuário logado.
 */
export async function lancar(input: {
  mes: number;
  ano: number;
  valor: number;
}): Promise<LancarResult> {
  const mes = Number(input.mes);
  const ano = Number(input.ano);
  const valor = Number(input.valor);

  if (!(mes >= 1 && mes <= 12)) return { ok: false, error: "Mês inválido." };
  if (!ano || ano < 2000) return { ok: false, error: "Ano inválido." };
  if (isNaN(valor) || valor < 0)
    return { ok: false, error: "Valor inválido." };

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Entre de novo." };

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!tenant) return { ok: false, error: "Cadastro não encontrado." };

  const { error } = await supabase
    .from("lancamentos")
    .upsert(
      { tenant_id: tenant.id, mes, ano, valor },
      { onConflict: "tenant_id,mes,ano" }
    );

  if (error) {
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath("/app");
  revalidatePath("/app/historico");
  revalidatePath("/app/relatorio");
  return { ok: true };
}
