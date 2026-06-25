"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CategoriaOption, TipoLancamento } from "@/lib/types";

export interface LancarResult {
  ok: boolean;
  error?: string;
}

async function getTenantId(
  supabase: ReturnType<typeof createClient>
): Promise<{ tenantId?: string; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entre de novo." };

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!tenant) return { error: "Cadastro não encontrado." };
  return { tenantId: tenant.id as string };
}

/**
 * Lança uma receita ou despesa.
 *  - receita: 1 por mês (substitui o valor existente);
 *  - despesa: acumula (cada lançamento é uma nova linha) e exige categoria.
 * RLS garante que só mexe no tenant do próprio usuário.
 */
export async function lancar(input: {
  mes: number;
  ano: number;
  valor: number;
  tipo: TipoLancamento;
  categoriaId?: string | null;
}): Promise<LancarResult> {
  const mes = Number(input.mes);
  const ano = Number(input.ano);
  const valor = Number(input.valor);
  const tipo: TipoLancamento = input.tipo === "despesa" ? "despesa" : "receita";

  if (!(mes >= 1 && mes <= 12)) return { ok: false, error: "Mês inválido." };
  if (!ano || ano < 2000) return { ok: false, error: "Ano inválido." };
  if (isNaN(valor) || valor <= 0) return { ok: false, error: "Valor inválido." };
  if (tipo === "despesa" && !input.categoriaId)
    return { ok: false, error: "Escolha a categoria da despesa." };

  const supabase = createClient();
  const { tenantId, error } = await getTenantId(supabase);
  if (!tenantId) return { ok: false, error };

  if (tipo === "receita") {
    // Uma receita por mês: atualiza se já existir, senão insere.
    const { data: existente } = await supabase
      .from("lancamentos")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("mes", mes)
      .eq("ano", ano)
      .eq("tipo", "receita")
      .maybeSingle();

    const res = existente
      ? await supabase
          .from("lancamentos")
          .update({ valor })
          .eq("id", existente.id)
      : await supabase
          .from("lancamentos")
          .insert({ tenant_id: tenantId, mes, ano, valor, tipo: "receita" });

    if (res.error) return { ok: false, error: "Não foi possível salvar." };
  } else {
    // Despesa: acumula.
    const { error: insErr } = await supabase.from("lancamentos").insert({
      tenant_id: tenantId,
      mes,
      ano,
      valor,
      tipo: "despesa",
      categoria_id: input.categoriaId,
    });
    if (insErr) return { ok: false, error: "Não foi possível salvar." };
  }

  revalidatePath("/app");
  revalidatePath("/app/historico");
  revalidatePath("/app/relatorio");
  return { ok: true };
}

export interface CriarCategoriaResult {
  ok: boolean;
  categoria?: CategoriaOption;
  error?: string;
}

/** Cria uma nova categoria de despesa do tenant do usuário logado. */
export async function criarCategoria(
  nome: string
): Promise<CriarCategoriaResult> {
  const limpo = (nome || "").trim();
  if (limpo.length < 2)
    return { ok: false, error: "Digite um nome para a categoria." };

  const supabase = createClient();
  const { tenantId, error } = await getTenantId(supabase);
  if (!tenantId) return { ok: false, error };

  const { data, error: insErr } = await supabase
    .from("categorias_despesa")
    .insert({ tenant_id: tenantId, nome: limpo, is_padrao: false })
    .select("id, nome, icone")
    .single();

  if (insErr || !data) {
    return { ok: false, error: "Não foi possível criar a categoria." };
  }

  revalidatePath("/app");
  return { ok: true, categoria: data as CategoriaOption };
}
