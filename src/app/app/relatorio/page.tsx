import EnviarContador from "@/components/EnviarContador";
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

      {/* Resumo do ano */}
      <div className="card flex flex-col gap-3">
        <Linha titulo="Faturamento total" valor={formatBRL(resumo.total)} />
        <Linha titulo="Limite anual" valor={formatBRL(LIMITE_MEI)} />
        <Linha titulo="Disponível" valor={formatBRL(resumo.disponivel)} />
        <div className="border-t border-gray-100 pt-3">
          <Linha
            titulo="% do limite usado"
            valor={formatPct(resumo.pctUsado)}
            destaque
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

function Linha({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{titulo}</span>
      <span
        className={`font-bold ${
          destaque ? "text-lg text-primary" : "text-gray-900"
        }`}
      >
        {valor}
      </span>
    </div>
  );
}
