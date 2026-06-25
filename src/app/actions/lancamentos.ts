"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CategoriaOption, TipoLancamento } from "@/lib/types";
import { FORMAS_PAGAMENTO } from "@/lib/constants";

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
 * Lança uma receita ou despesa (cada lançamento é uma linha — múltiplos
 * por mês são permitidos). mes/ano são derivados de data_lancamento.
 * Obrigatórios: data, valor, forma de pagamento (e categoria, se despesa).
 * Opcionais: nome da parte, número do documento, descrição.
 */
export async function lancar(input: {
  tipo: TipoLancamento;
  valor: number;
  categoriaId?: string | null;
  data: string; // YYYY-MM-DD
  formaPagamento: string;
  nomeParte?: string | null;
  numeroDocumento?: string | null;
  descricao?: string | null;
}): Promise<LancarResult> {
  const tipo: TipoLancamento = input.tipo === "despesa" ? "despesa" : "receita";
  const valor = Number(input.valor);
  const data = (input.data || "").trim();

  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
  if (!m) return { ok: false, error: "Informe uma data válida." };
  const ano = parseInt(m[1], 10);
  const mes = parseInt(m[2], 10);
  if (!(mes >= 1 && mes <= 12) || ano < 2000)
    return { ok: false, error: "Data inválida." };

  if (isNaN(valor) || valor <= 0) return { ok: false, error: "Valor inválido." };

  const formaPagamento = (input.formaPagamento || "").trim();
  if (!FORMAS_PAGAMENTO.includes(formaPagamento as (typeof FORMAS_PAGAMENTO)[number]))
    return { ok: false, error: "Escolha a forma de pagamento." };

  if (tipo === "despesa" && !input.categoriaId)
    return { ok: false, error: "Escolha a categoria da despesa." };

  const supabase = createClient();
  const { tenantId, error } = await getTenantId(supabase);
  if (!tenantId) return { ok: false, error };

  const nome_parte = (input.nomeParte || "").trim().slice(0, 100) || null;
  const numero_documento =
    (input.numeroDocumento || "").trim().slice(0, 50) || null;
  const descricao = (input.descricao || "").trim().slice(0, 200) || null;

  const { error: insErr } = await supabase.from("lancamentos").insert({
    tenant_id: tenantId,
    mes,
    ano,
    valor,
    tipo,
    categoria_id: tipo === "despesa" ? input.categoriaId : null,
    data_lancamento: data,
    forma_pagamento: formaPagamento,
    nome_parte,
    numero_documento,
    descricao,
  });

  if (insErr) return { ok: false, error: "Não foi possível salvar. Tente de novo." };

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
