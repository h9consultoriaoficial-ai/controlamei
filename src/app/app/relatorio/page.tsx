import EnviarContador from "@/components/EnviarContador";
import TabelaMensal from "@/components/TabelaMensal";
import { getTenantOrRedirect } from "@/lib/tenant";
import { createClient } from "@/lib/supabase/server";
import { calcularResumo } from "@/lib/mei";
import { formatBRL, formatPct } from "@/lib/format";
import { LIMITE_MEI } from "@/lib/constants";
import type { Lancamento } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RelatorioPage() {
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
        <h1 className="text-2xl font-extrabold text-gray-900">Relatório</h1>
        <p className="text-gray-500">
          Envie o resumo de {ano} pro seu contador.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        <Card titulo="Faturamento total" valor={formatBRL(resumo.total)} destaque />
        <Card titulo="Limite anual" valor={formatBRL(LIMITE_MEI)} />
        <Card titulo="Disponível" valor={formatBRL(resumo.disponivel)} />
        <Card titulo="% do limite usado" valor={formatPct(resumo.pctUsado)} />
      </div>

      {/* Tabela detalhada mês a mês */}
      <div className="card overflow-hidden p-0">
        <h2 className="border-b border-gray-100 px-5 py-4 text-lg font-bold text-gray-900">
          Detalhe por mês — {ano}
        </h2>
        <div className="px-5 pb-3 pt-1">
          <TabelaMensal
            valoresPorMes={resumo.valoresPorMes}
            total={resumo.total}
            pctUsado={resumo.pctUsado}
          />
        </div>
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
  destaque,
}: {
  titulo: string;
  valor: string;
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
    </div>
  );
}
