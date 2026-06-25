import type { SupabaseClient } from "@supabase/supabase-js";
import { CATEGORIAS_PADRAO } from "./constants";
import type { CategoriaOption } from "./types";

/**
 * Garante que o tenant tenha as categorias padrão e devolve a lista atual
 * (ordenada por nome). Se ainda não houver nenhuma, semeia as padrão.
 *
 * Cobre dois casos:
 *  - tenants criados ANTES do módulo de despesas (auto-seed na 1ª visita);
 *  - rede de segurança caso o seed do cadastro tenha falhado.
 *
 * Usa o client recebido (sessão do usuário, com RLS) — o insert só passa
 * para o tenant do próprio usuário.
 */
export async function garantirCategoriasPadrao(
  supabase: SupabaseClient,
  tenantId: string
): Promise<CategoriaOption[]> {
  const { data: existentes } = await supabase
    .from("categorias_despesa")
    .select("id, nome, icone")
    .eq("tenant_id", tenantId)
    .order("nome");

  if (existentes && existentes.length > 0) {
    return existentes as CategoriaOption[];
  }

  // Semeia as padrão.
  const novas = CATEGORIAS_PADRAO.map((c) => ({
    tenant_id: tenantId,
    nome: c.nome,
    icone: c.icone,
    is_padrao: true,
  }));

  const { data: inseridas } = await supabase
    .from("categorias_despesa")
    .insert(novas)
    .select("id, nome, icone");

  // Ordena por nome para exibição consistente.
  return ((inseridas as CategoriaOption[]) || []).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}
