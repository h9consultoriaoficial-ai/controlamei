import type { SupabaseClient } from "@supabase/supabase-js";
import {
  calcularResumo,
  rankingCategorias,
  type CategoriaGasto,
  type ResumoAnual,
} from "./mei";

interface RowCategoria {
  nome: string;
}

interface LancamentoRow {
  id: string;
  mes: number;
  valor: number;
  tipo: string;
  categoria_id: string | null;
  data_lancamento: string | null;
  forma_pagamento: string | null;
  nome_parte: string | null;
  numero_documento: string | null;
  descricao: string | null;
  created_at: string;
  categorias_despesa: RowCategoria | RowCategoria[] | null;
}

/** Lançamento detalhado (enriquecido com o nome da categoria) para listagens. */
export interface LancamentoDetalhe {
  id: string;
  tipo: string;
  valor: number;
  mes: number;
  categoriaNome: string | null;
  data: string | null; // data_lancamento (YYYY-MM-DD)
  forma_pagamento: string | null;
  nome_parte: string | null;
  numero_documento: string | null;
  descricao: string | null;
}

/** Data efetiva (data_lancamento, com fallback no created_at) só com o dia. */
function dataEfetiva(r: LancamentoRow): string {
  return (r.data_lancamento || r.created_at || "").slice(0, 10);
}

/**
 * Carrega os lançamentos do ano (receitas + despesas) e devolve o resumo
 * anual, o ranking de categorias e a lista detalhada (ordenada do mais
 * recente para o mais antigo). Usado nas telas autenticadas (client de
 * sessão) e na rota pública (service role) — ambos SupabaseClient.
 */
export async function carregarAno(
  supabase: SupabaseClient,
  tenantId: string,
  ano: number,
  limite: number
): Promise<{
  resumo: ResumoAnual;
  ranking: CategoriaGasto[];
  lancamentos: LancamentoDetalhe[];
}> {
  const { data } = await supabase
    .from("lancamentos")
    .select(
      "id, mes, valor, tipo, categoria_id, data_lancamento, forma_pagamento, nome_parte, numero_documento, descricao, created_at, categorias_despesa(nome)"
    )
    .eq("tenant_id", tenantId)
    .eq("ano", ano);

  const rows = (data ?? []) as unknown as LancamentoRow[];

  const resumo = calcularResumo(
    rows.map((r) => ({
      mes: r.mes,
      valor: Number(r.valor) || 0,
      tipo: r.tipo,
    })),
    limite
  );

  const despesas = rows
    .filter((r) => r.tipo === "despesa")
    .map((r) => {
      const cat = Array.isArray(r.categorias_despesa)
        ? r.categorias_despesa[0]
        : r.categorias_despesa;
      return { valor: Number(r.valor) || 0, nome: cat?.nome ?? "Sem categoria" };
    });

  const lancamentos: LancamentoDetalhe[] = rows
    .slice()
    .sort((a, b) => dataEfetiva(b).localeCompare(dataEfetiva(a)))
    .map((r) => {
      const cat = Array.isArray(r.categorias_despesa)
        ? r.categorias_despesa[0]
        : r.categorias_despesa;
      return {
        id: r.id,
        tipo: r.tipo,
        valor: Number(r.valor) || 0,
        mes: r.mes,
        categoriaNome: cat?.nome ?? null,
        data: r.data_lancamento,
        forma_pagamento: r.forma_pagamento,
        nome_parte: r.nome_parte,
        numero_documento: r.numero_documento,
        descricao: r.descricao,
      };
    });

  return { resumo, ranking: rankingCategorias(despesas), lancamentos };
}
