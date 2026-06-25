import { ALERTA_AMARELO, ALERTA_VERMELHO, LIMITE_MEI } from "./constants";

export type StatusSemaforo = "verde" | "amarelo" | "vermelho";

/** Retorna o status do semáforo com base no % do limite usado. */
export function getStatus(pctUsado: number): StatusSemaforo {
  if (pctUsado >= ALERTA_VERMELHO) return "vermelho";
  if (pctUsado >= ALERTA_AMARELO) return "amarelo";
  return "verde";
}

export interface ResumoAnual {
  total: number;
  disponivel: number;
  pctUsado: number;
  status: StatusSemaforo;
  mediaMensal: number;
  melhorMes: { mes: number; valor: number } | null;
  /** Valores indexados por mês 0..11 (Jan..Dez). */
  valoresPorMes: number[];
}

/**
 * Calcula o resumo anual a partir dos lançamentos.
 * @param lancamentos lista de { mes (1-12), valor }
 */
export function calcularResumo(
  lancamentos: { mes: number; valor: number }[]
): ResumoAnual {
  const valoresPorMes = new Array(12).fill(0);
  for (const l of lancamentos) {
    if (l.mes >= 1 && l.mes <= 12) {
      valoresPorMes[l.mes - 1] += Number(l.valor) || 0;
    }
  }

  const total = valoresPorMes.reduce((a, b) => a + b, 0);
  const disponivel = Math.max(LIMITE_MEI - total, 0);
  const pctUsado = (total / LIMITE_MEI) * 100;
  const status = getStatus(pctUsado);

  const mesesComValor = valoresPorMes.filter((v) => v > 0).length;
  const mediaMensal = mesesComValor > 0 ? total / mesesComValor : 0;

  let melhorMes: { mes: number; valor: number } | null = null;
  valoresPorMes.forEach((valor, i) => {
    if (valor > 0 && (!melhorMes || valor > melhorMes.valor)) {
      melhorMes = { mes: i + 1, valor };
    }
  });

  return {
    total,
    disponivel,
    pctUsado,
    status,
    mediaMensal,
    melhorMes,
    valoresPorMes,
  };
}
