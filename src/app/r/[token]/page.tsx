import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcularResumo } from "@/lib/mei";
import { formatBRL, formatPct, formatCPF } from "@/lib/format";
import { LIMITE_MEI, MESES_LONGOS, TIPOS_ATIVIDADE } from "@/lib/constants";
import type { Lancamento, Relatorio, Tenant } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relatório de Faturamento — Controla MEI",
  robots: { index: false, follow: false },
};

async function carregar(token: string) {
  const admin = createAdminClient();

  // 1) Relatório pelo token (capability — token UUID não-adivinhável).
  const { data: relatorio } = await admin
    .from("relatorios")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!relatorio) return null;
  const rel = relatorio as Relatorio;

  // 2) Tenant do relatório.
  const { data: tenant } = await admin
    .from("tenants")
    .select("*")
    .eq("id", rel.tenant_id)
    .maybeSingle();

  if (!tenant) return null;

  // 3) Lançamentos do ano do relatório.
  const ano = rel.ano ?? new Date().getFullYear();
  const { data: lancamentos } = await admin
    .from("lancamentos")
    .select("mes, valor")
    .eq("tenant_id", rel.tenant_id)
    .eq("ano", ano);

  return {
    tenant: tenant as Tenant,
    ano,
    resumo: calcularResumo((lancamentos as Lancamento[]) || []),
  };
}

export default async function RelatorioPublicoPage({
  params,
}: {
  params: { token: string };
}) {
  const dados = await carregar(params.token);
  if (!dados) notFound();

  const { tenant, ano, resumo } = dados;
  const tipoLabel =
    TIPOS_ATIVIDADE.find((t) => t.value === tenant.tipo_atividade)?.label ||
    "—";

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-2xl px-5">
        {/* Cabeçalho */}
        <div className="rounded-t-2xl bg-primary px-6 py-6 text-white">
          <Logo size="md" withText light />
          <h1 className="mt-4 text-2xl font-extrabold">
            Relatório de Faturamento
          </h1>
          <p className="text-primary-light/90">Ano-base {ano}</p>
        </div>

        {/* Dados do MEI */}
        <div className="bg-white px-6 py-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            Dados do MEI
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Item rotulo="Nome" valor={tenant.nome} />
            <Item rotulo="CPF" valor={formatCPF(tenant.cpf)} />
            <Item rotulo="Atividade" valor={tipoLabel} />
            {tenant.whatsapp && (
              <Item rotulo="Contato" valor={tenant.whatsapp} />
            )}
          </dl>
        </div>

        {/* Resumo */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            Resumo do ano
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Resumo titulo="Total faturado" valor={formatBRL(resumo.total)} />
            <Resumo titulo="Limite anual" valor={formatBRL(LIMITE_MEI)} />
            <Resumo titulo="Disponível" valor={formatBRL(resumo.disponivel)} />
            <Resumo
              titulo="% usado"
              valor={formatPct(resumo.pctUsado)}
              status={resumo.status}
            />
          </div>
        </div>

        {/* Tabela mês a mês */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            Faturamento mês a mês
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {resumo.valoresPorMes.map((valor, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 text-gray-600">{MESES_LONGOS[i]}</td>
                  <td
                    className={`py-2 text-right font-semibold ${
                      valor > 0 ? "text-gray-900" : "text-gray-300"
                    }`}
                  >
                    {valor > 0 ? formatBRL(valor) : "—"}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-bold text-primary">Total anual</td>
                <td className="py-3 text-right text-lg font-extrabold text-primary">
                  {formatBRL(resumo.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="rounded-b-2xl border-t border-gray-100 bg-white px-6 py-5 text-center text-sm text-gray-400">
          Gerado pelo Controla MEI — controlamei.com.br
        </div>
      </div>
    </main>
  );
}

function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{rotulo}</dt>
      <dd className="font-semibold text-gray-900">{valor}</dd>
    </div>
  );
}

function Resumo({
  titulo,
  valor,
  status,
}: {
  titulo: string;
  valor: string;
  status?: "verde" | "amarelo" | "vermelho";
}) {
  const cor =
    status === "vermelho"
      ? "text-semaforo-vermelho"
      : status === "amarelo"
      ? "text-semaforo-amarelo"
      : status === "verde"
      ? "text-semaforo-verde"
      : "text-gray-900";
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-xs text-gray-400">{titulo}</p>
      <p className={`mt-0.5 text-base font-extrabold ${cor}`}>{valor}</p>
    </div>
  );
}
