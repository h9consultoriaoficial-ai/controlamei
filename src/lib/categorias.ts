import type { SupabaseClient } from "@supabase/supabase-js";
import { CATEGORIAS_PADRAO } from "./constants";
import type { CategoriaOption } from "./types";

/**
 * Garante que o tenant tenha as categorias padrão e devolve a lista atual
 * (ordenada por nome). Faz "top-up": insere apenas as padrão que ainda
 * faltam (comparando por nome), sem duplicar as que já existem.
 *
 * Cobre três casos:
 *  - tenants criados ANTES do módulo de despesas (semeia todas na 1ª visita);
 *  - tenants que já têm as padrão antigas e ganham as novas (ex.: fretes,
 *    matéria-prima) automaticamente;
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

  const atuais = (existentes as CategoriaOption[]) || [];
  const nomesExistentes = new Set(
    atuais.map((c) => c.nome.trim().toLowerCase())
  );

  // Quais categorias padrão ainda faltam?
  const faltantes = CATEGORIAS_PADRAO.filter(
    (c) => !nomesExistentes.has(c.nome.trim().toLowerCase())
  );

  if (faltantes.length === 0) {
    return atuais;
  }

  const { data: inseridas } = await supabase
    .from("categorias_despesa")
    .insert(
      faltantes.map((c) => ({
        tenant_id: tenantId,
        nome: c.nome,
        icone: c.icone,
        is_padrao: true,
      }))
    )
    .select("id, nome, icone");

  return [...atuais, ...((inseridas as CategoriaOption[]) || [])].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}
