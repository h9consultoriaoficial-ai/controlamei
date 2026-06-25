import HistoricoChart from "@/components/HistoricoChart";
import TabelaMensal from "@/components/TabelaMensal";
import RankingCategorias from "@/components/RankingCategorias";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";
import { carregarAno } from "@/lib/dados";
import { formatBRL, formatPct } from "@/lib/format";
import { getLimite } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = createClient();

  const ano = new Date().getFullYear();
  const { resumo, ranking } = await carregarAno(
    supabase,
    tenant.id,
    ano,
    getLimite(tenant.tipo_mei)
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Histórico</h1>
        <p className="text-gray-500">Resumo do ano de {ano}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          titulo="Total receitas"
          valor={formatBRL(resumo.totalReceitas)}
          cor="text-semaforo-verde"
        />
        <Card
          titulo="Total despesas"
          valor={formatBRL(resumo.totalDespesas)}
          cor="text-semaforo-vermelho"
        />
        <Card
          titulo="Saldo líquido"
          valor={formatBRL(resumo.saldoLiquido)}
          cor={
            resumo.saldoLiquido >= 0
              ? "text-semaforo-verde"
              : "text-semaforo-vermelho"
          }
        />
        <Card titulo="% do limite" valor={formatPct(resumo.pctUsado)} />
      </div>

      {/* Gráfico de barras duplas */}
      <div className="card">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          Receitas x Despesas por mês
        </h2>
        <HistoricoChart
          receitasPorMes={resumo.receitasPorMes}
          despesasPorMes={resumo.despesasPorMes}
        />
      </div>

      {/* Tabela mês a mês */}
      <div className="card overflow-hidden p-0">
        <h2 className="border-b border-gray-100 px-5 py-4 text-lg font-bold text-gray-900">
          Detalhe por mês
        </h2>
        <div className="px-5 pb-3 pt-1">
          <TabelaMensal
            receitasPorMes={resumo.receitasPorMes}
            despesasPorMes={resumo.despesasPorMes}
          />
        </div>
      </div>

      {/* Ranking de categorias de despesa */}
      <div className="card">
        <h2 className="mb-1 text-lg font-bold text-gray-900">
          Despesas por categoria
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Onde seu dinheiro foi gasto em {ano}.
        </p>
        <RankingCategorias ranking={ranking} />
      </div>
    </div>
  );
}

function Card({
  titulo,
  valor,
  cor,
}: {
  titulo: string;
  valor: string;
  cor?: string;
}) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`mt-1 text-xl font-extrabold ${cor || "text-gray-900"}`}>
        {valor}
      </p>
    </div>
  );
}
