import { LIMITE_MEI, MESES_LONGOS } from "@/lib/constants";
import { formatBRL, formatPct } from "@/lib/format";

/**
 * Tabela detalhada mês a mês: Mês | Faturamento | % do limite usado no mês.
 * Última linha = total do ano (soma + % total). Meses sem lançamento
 * aparecem como R$ 0,00 / 0%.
 *
 * Componente de apresentação (server-friendly) reusado na tela /app/relatorio
 * e na rota pública /r/[token].
 */
export default function TabelaMensal({
  valoresPorMes,
  total,
  pctUsado,
}: {
  valoresPorMes: number[];
  total: number;
  pctUsado: number;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-gray-500">
          <th className="py-2.5 pr-2 text-left font-medium">Mês</th>
          <th className="py-2.5 px-2 text-right font-medium">Faturamento</th>
          <th className="py-2.5 pl-2 text-right font-medium">% limite</th>
        </tr>
      </thead>
      <tbody>
        {valoresPorMes.map((valor, i) => {
          const pctMes = (valor / LIMITE_MEI) * 100;
          const tem = valor > 0;
          return (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 pr-2 text-gray-700">{MESES_LONGOS[i]}</td>
              <td
                className={`py-2.5 px-2 text-right font-semibold ${
                  tem ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {formatBRL(valor)}
              </td>
              <td
                className={`py-2.5 pl-2 text-right ${
                  tem ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {formatPct(pctMes)}
              </td>
            </tr>
          );
        })}
        <tr className="bg-primary-light font-bold text-primary">
          <td className="rounded-l-lg py-3 pl-2 pr-2">Total</td>
          <td className="py-3 px-2 text-right">{formatBRL(total)}</td>
          <td className="rounded-r-lg py-3 pl-2 pr-2 text-right">
            {formatPct(pctUsado)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
