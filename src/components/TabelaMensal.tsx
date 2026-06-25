import { MESES_LONGOS } from "@/lib/constants";
import { formatBRL } from "@/lib/format";

/**
 * Tabela mês a mês: Mês | Receitas | Despesas | Saldo.
 * Receitas em verde, despesas em vermelho, saldo verde (>=0) ou vermelho (<0).
 * Última linha = total do ano. Reusada em /app/relatorio e /r/[token].
 */
export default function TabelaMensal({
  receitasPorMes,
  despesasPorMes,
}: {
  receitasPorMes: number[];
  despesasPorMes: number[];
}) {
  const totalR = receitasPorMes.reduce((a, b) => a + b, 0);
  const totalD = despesasPorMes.reduce((a, b) => a + b, 0);
  const saldoTotal = totalR - totalD;

  const corSaldo = (v: number) =>
    v > 0
      ? "text-semaforo-verde"
      : v < 0
      ? "text-semaforo-vermelho"
      : "text-gray-400";

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-gray-500">
          <th className="py-2.5 pr-2 text-left font-medium">Mês</th>
          <th className="py-2.5 px-2 text-right font-medium">Receitas</th>
          <th className="py-2.5 px-2 text-right font-medium">Despesas</th>
          <th className="py-2.5 pl-2 text-right font-medium">Saldo</th>
        </tr>
      </thead>
      <tbody>
        {MESES_LONGOS.map((nome, i) => {
          const r = receitasPorMes[i] || 0;
          const d = despesasPorMes[i] || 0;
          const saldo = r - d;
          return (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 pr-2 text-gray-700">{nome}</td>
              <td
                className={`py-2.5 px-2 text-right font-semibold ${
                  r > 0 ? "text-semaforo-verde" : "text-gray-400"
                }`}
              >
                {formatBRL(r)}
              </td>
              <td
                className={`py-2.5 px-2 text-right font-semibold ${
                  d > 0 ? "text-semaforo-vermelho" : "text-gray-400"
                }`}
              >
                {formatBRL(d)}
              </td>
              <td className={`py-2.5 pl-2 text-right font-semibold ${corSaldo(saldo)}`}>
                {formatBRL(saldo)}
              </td>
            </tr>
          );
        })}
        <tr className="bg-gray-50 font-bold">
          <td className="rounded-l-lg py-3 pl-2 pr-2 text-gray-900">Total</td>
          <td className="py-3 px-2 text-right text-semaforo-verde">
            {formatBRL(totalR)}
          </td>
          <td className="py-3 px-2 text-right text-semaforo-vermelho">
            {formatBRL(totalD)}
          </td>
          <td
            className={`rounded-r-lg py-3 pl-2 pr-2 text-right ${corSaldo(
              saldoTotal
            )}`}
          >
            {formatBRL(saldoTotal)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
