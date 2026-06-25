import HistoricoChart from "@/components/HistoricoChart";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";
import { calcularResumo } from "@/lib/mei";
import { formatBRL, formatPct } from "@/lib/format";
import { MESES_LONGOS } from "@/lib/constants";
import type { Lancamento } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = createClient();

  const ano = new Date().getFullYear();

  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("mes, valor")
    .eq("tenant_id", tenant.id)
    .eq("ano", ano);

  const resumo = calcularResumo((lancamentos as Lancamento[]) || []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Histórico</h1>
        <p className="text-gray-500">Resumo do ano de {ano}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card titulo="Total do ano" valor={formatBRL(resumo.total)} destaque />
        <Card titulo="Média mensal" valor={formatBRL(resumo.mediaMensal)} />
        <Card
          titulo="Melhor mês"
          valor={
            resumo.melhorMes
              ? MESES_LONGOS[resumo.melhorMes.mes - 1]
              : "—"
          }
          sub={resumo.melhorMes ? formatBRL(resumo.melhorMes.valor) : undefined}
        />
        <Card titulo="% do limite" valor={formatPct(resumo.pctUsado)} />
      </div>

      {/* Gráfico */}
      <div className="card">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          Faturamento mês a mês
        </h2>
        <HistoricoChart valoresPorMes={resumo.valoresPorMes} />
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden p-0">
        <h2 className="border-b border-gray-100 px-5 py-4 text-lg font-bold text-gray-900">
          Detalhe por mês
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-5 py-2.5 font-medium">Mês</th>
              <th className="px-5 py-2.5 text-right font-medium">Faturamento</th>
            </tr>
          </thead>
          <tbody>
            {resumo.valoresPorMes.map((valor, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="px-5 py-2.5 text-gray-700">
                  {MESES_LONGOS[i]}
                </td>
                <td
                  className={`px-5 py-2.5 text-right font-semibold ${
                    valor > 0 ? "text-gray-900" : "text-gray-300"
                  }`}
                >
                  {valor > 0 ? formatBRL(valor) : "—"}
                </td>
              </tr>
            ))}
            <tr className="bg-primary-light">
              <td className="px-5 py-3 font-bold text-primary">Total</td>
              <td className="px-5 py-3 text-right font-extrabold text-primary">
                {formatBRL(resumo.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({
  titulo,
  valor,
  sub,
  destaque,
}: {
  titulo: string;
  valor: string;
  sub?: string;
  destaque?: boolean;
}) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p
        className={`mt-1 text-xl font-extrabold ${
          destaque ? "text-primary" : "text-gray-900"
        }`}
      >
        {valor}
      </p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
