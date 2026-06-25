import Link from "next/link";
import Semaforo from "@/components/Semaforo";
import PainelLancamento from "@/components/PainelLancamento";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";
import { carregarAno } from "@/lib/dados";
import { garantirCategoriasPadrao } from "@/lib/categorias";
import { formatBRL } from "@/lib/format";
import { LIMITE_MEI } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AppHomePage() {
  const { tenant } = await getTenantOrRedirect();
  const supabase = createClient();

  const agora = new Date();
  const ano = agora.getFullYear();
  const mesAtual = agora.getMonth() + 1;

  const [{ resumo }, categorias] = await Promise.all([
    carregarAno(supabase, tenant.id, ano),
    garantirCategoriasPadrao(supabase, tenant.id),
  ]);

  const primeiroNome = tenant.nome.split(" ")[0];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Olá, {primeiroNome}! 👋
        </h1>
        <p className="text-gray-500">Faturamento de {ano}</p>
      </div>

      <Semaforo status={resumo.status} pctUsado={resumo.pctUsado} />

      {/* Alertas (regra MEI = só receitas) */}
      {resumo.status === "amarelo" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="font-bold text-amber-800">⚠️ Você já passou de 80%!</p>
          <p className="mt-1 text-sm text-amber-700">
            Fique de olho: faltam só {formatBRL(resumo.disponivel)} para o
            limite. Controle as próximas vendas.
          </p>
        </div>
      )}

      {resumo.status === "vermelho" && (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4">
          <p className="font-bold text-red-800">
            🚨 Você ultrapassou o limite de {formatBRL(LIMITE_MEI)}!
          </p>
          <p className="mt-1 text-sm text-red-700">
            Fale com seu contador para entender como regularizar e evitar
            problemas.
          </p>
          <Link
            href="/app/relatorio"
            className="mt-3 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Fale com seu contador
          </Link>
        </div>
      )}

      {/* Resumo: faturamento (receitas) vs disponível */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-sm text-gray-500">Total faturado</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900">
            {formatBRL(resumo.totalReceitas)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Ainda disponível</p>
          <p className="mt-1 text-xl font-extrabold text-primary">
            {formatBRL(resumo.disponivel)}
          </p>
        </div>
      </div>

      {/* Despesas do ano (informativo, não conta no limite) */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Despesas do ano</p>
          <p className="mt-1 text-xl font-extrabold text-semaforo-vermelho">
            {formatBRL(resumo.totalDespesas)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Saldo líquido</p>
          <p
            className={`mt-1 text-xl font-extrabold ${
              resumo.saldoLiquido >= 0
                ? "text-semaforo-verde"
                : "text-semaforo-vermelho"
            }`}
          >
            {formatBRL(resumo.saldoLiquido)}
          </p>
        </div>
      </div>

      <PainelLancamento
        ano={ano}
        receitasPorMes={resumo.receitasPorMes}
        mesAtual={mesAtual}
        categorias={categorias}
      />
    </div>
  );
}
