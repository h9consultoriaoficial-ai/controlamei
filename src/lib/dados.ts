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
  mes: number;
  valor: number;
  tipo: string;
  categoria_id: string | null;
  categorias_despesa: RowCategoria | RowCategoria[] | null;
}

/**
 * Carrega os lançamentos do ano (receitas + despesas) e devolve o resumo
 * anual e o ranking de categorias de despesa. Usado nas telas autenticadas
 * (client de sessão) e na rota pública (service role) — ambos SupabaseClient.
 */
export async function carregarAno(
  supabase: SupabaseClient,
  tenantId: string,
  ano: number
): Promise<{ resumo: ResumoAnual; ranking: CategoriaGasto[] }> {
  const { data } = await supabase
    .from("lancamentos")
    .select("mes, valor, tipo, categoria_id, categorias_despesa(nome)")
    .eq("tenant_id", tenantId)
    .eq("ano", ano);

  const rows = (data ?? []) as unknown as LancamentoRow[];

  const resumo = calcularResumo(
    rows.map((r) => ({
      mes: r.mes,
      valor: Number(r.valor) || 0,
      tipo: r.tipo,
    }))
  );

  const despesas = rows
    .filter((r) => r.tipo === "despesa")
    .map((r) => {
      const cat = Array.isArray(r.categorias_despesa)
        ? r.categorias_despesa[0]
        : r.categorias_despesa;
      return {
        valor: Number(r.valor) || 0,
        nome: cat?.nome ?? "Sem categoria",
      };
    });

  return { resumo, ranking: rankingCategorias(despesas) };
}
