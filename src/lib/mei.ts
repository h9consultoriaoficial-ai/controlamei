import { ALERTA_AMARELO, ALERTA_VERMELHO, LIMITE_MEI } from "./constants";

export type StatusSemaforo = "verde" | "amarelo" | "vermelho";

/** Retorna o status do semáforo com base no % do limite usado (só receitas). */
export function getStatus(pctUsado: number): StatusSemaforo {
  if (pctUsado >= ALERTA_VERMELHO) return "vermelho";
  if (pctUsado >= ALERTA_AMARELO) return "amarelo";
  return "verde";
}

export interface ResumoAnual {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number; // receitas - despesas (informativo)
  disponivel: number; // limite - receitas
  pctUsado: number; // receitas / limite (regra MEI)
  status: StatusSemaforo;
  mediaMensal: number; // média das receitas nos meses com receita
  melhorMes: { mes: number; valor: number } | null; // por receita
  receitasPorMes: number[]; // índice 0..11 (Jan..Dez)
  despesasPorMes: number[];
}

export interface LancamentoCalc {
  mes: number;
  valor: number;
  tipo: string; // 'receita' | 'despesa'
}

/**
 * Calcula o resumo anual separando receitas e despesas.
 * IMPORTANTE: o limite do MEI (R$ 81.000) considera APENAS receitas.
 * As despesas são gerenciais/informativas.
 */
export function calcularResumo(lancamentos: LancamentoCalc[]): ResumoAnual {
  const receitasPorMes = new Array(12).fill(0);
  const despesasPorMes = new Array(12).fill(0);

  for (const l of lancamentos) {
    if (l.mes >= 1 && l.mes <= 12) {
      const v = Number(l.valor) || 0;
      if (l.tipo === "despesa") despesasPorMes[l.mes - 1] += v;
      else receitasPorMes[l.mes - 1] += v;
    }
  }

  const totalReceitas = receitasPorMes.reduce((a, b) => a + b, 0);
  const totalDespesas = despesasPorMes.reduce((a, b) => a + b, 0);
  const saldoLiquido = totalReceitas - totalDespesas;
  const disponivel = Math.max(LIMITE_MEI - totalReceitas, 0);
  const pctUsado = (totalReceitas / LIMITE_MEI) * 100;
  const status = getStatus(pctUsado);

  const mesesComReceita = receitasPorMes.filter((v) => v > 0).length;
  const mediaMensal = mesesComReceita > 0 ? totalReceitas / mesesComReceita : 0;

  let melhorMes: { mes: number; valor: number } | null = null;
  receitasPorMes.forEach((valor, i) => {
    if (valor > 0 && (!melhorMes || valor > melhorMes.valor)) {
      melhorMes = { mes: i + 1, valor };
    }
  });

  return {
    totalReceitas,
    totalDespesas,
    saldoLiquido,
    disponivel,
    pctUsado,
    status,
    mediaMensal,
    melhorMes,
    receitasPorMes,
    despesasPorMes,
  };
}

export interface CategoriaGasto {
  nome: string;
  total: number;
  pct: number; // % do total de despesas
}

/**
 * Agrupa despesas por categoria, calcula o % de cada uma sobre o total
 * de despesas e ordena do maior para o menor gasto.
 */
export function rankingCategorias(
  despesas: { valor: number; nome: string }[]
): CategoriaGasto[] {
  const mapa = new Map<string, number>();
  let total = 0;

  for (const d of despesas) {
    const v = Number(d.valor) || 0;
    total += v;
    mapa.set(d.nome, (mapa.get(d.nome) || 0) + v);
  }

  return Array.from(mapa.entries())
    .map(([nome, t]) => ({
      nome,
      total: t,
      pct: total > 0 ? (t / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
