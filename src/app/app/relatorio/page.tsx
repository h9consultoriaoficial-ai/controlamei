import EnviarContador from "@/components/EnviarContador";
import TabelaMensal from "@/components/TabelaMensal";
import RankingCategorias from "@/components/RankingCategorias";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";
import { carregarAno } from "@/lib/dados";
import { formatBRL, formatPct } from "@/lib/format";
import { getLimite, labelTipoMei } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function RelatorioPage() {
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
        <h1 className="text-2xl font-extrabold text-gray-900">Relatório</h1>
        <p className="text-gray-500">
          Envie o resumo de {ano} pro seu contador.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          titulo="Receitas"
          valor={formatBRL(resumo.totalReceitas)}
          cor="text-semaforo-verde"
        />
        <Card
          titulo="Despesas"
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

      <p className="-mt-1 text-center text-xs text-gray-400">
        {labelTipoMei(tenant.tipo_mei)} — limite anual {formatBRL(resumo.limite)}{" "}
        (considera só receitas).
      </p>

      {/* Tabela mês a mês */}
      <div className="card overflow-hidden p-0">
        <h2 className="border-b border-gray-100 px-5 py-4 text-lg font-bold text-gray-900">
          Detalhe por mês — {ano}
        </h2>
        <div className="px-5 pb-3 pt-1">
          <TabelaMensal
            receitasPorMes={resumo.receitasPorMes}
            despesasPorMes={resumo.despesasPorMes}
          />
        </div>
      </div>

      {/* Ranking de categorias */}
      <div className="card">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Despesas por categoria
        </h2>
        <RankingCategorias ranking={ranking} />
      </div>

      {/* Dados do contador */}
      <div className="card">
        <p className="text-sm font-semibold text-gray-700">Contador</p>
        <p className="mt-1 text-gray-900">
          {tenant.nome_contador || "Não cadastrado"}
        </p>
        {tenant.whatsapp_contador && (
          <p className="text-sm text-gray-500">{tenant.whatsapp_contador}</p>
        )}
      </div>

      <EnviarContador temContador={Boolean(tenant.whatsapp_contador)} />

      <p className="text-center text-xs text-gray-400">
        Ao enviar, geramos um link público com o relatório do ano. O contador
        abre direto, sem precisar de login.
      </p>
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
