import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import TabelaMensal from "@/components/TabelaMensal";
import TabelaLancamentos from "@/components/TabelaLancamentos";
import RankingCategorias from "@/components/RankingCategorias";
import { createAdminClient } from "@/lib/supabase/admin";
import { carregarAno } from "@/lib/dados";
import { formatBRL, formatPct, formatCPF } from "@/lib/format";
import { getLimite, labelTipoMei, TIPOS_ATIVIDADE } from "@/lib/constants";
import type { Relatorio, Tenant } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relatório de Faturamento — MEI no Limite",
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
  const t = tenant as Tenant;

  // 3) Resumo + ranking do ano do relatório (limite conforme o tipo de MEI).
  const ano = rel.ano ?? new Date().getFullYear();
  const { resumo, ranking, lancamentos } = await carregarAno(
    admin,
    rel.tenant_id,
    ano,
    getLimite(t.tipo_mei)
  );

  return { tenant: t, ano, resumo, ranking, lancamentos };
}

export default async function RelatorioPublicoPage({
  params,
}: {
  params: { token: string };
}) {
  const dados = await carregar(params.token);
  if (!dados) notFound();

  const { tenant, ano, resumo, ranking, lancamentos } = dados;
  const cronologico = [...lancamentos].reverse(); // mais antigo -> mais recente
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
            <Item rotulo="Tipo de MEI" valor={labelTipoMei(tenant.tipo_mei)} />
            <Item rotulo="Atividade" valor={tipoLabel} />
            {tenant.whatsapp && <Item rotulo="Contato" valor={tenant.whatsapp} />}
          </dl>
        </div>

        {/* Resumo */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
            Resumo do ano
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Resumo
              titulo="Receitas"
              valor={formatBRL(resumo.totalReceitas)}
              cor="text-semaforo-verde"
            />
            <Resumo
              titulo="Despesas"
              valor={formatBRL(resumo.totalDespesas)}
              cor="text-semaforo-vermelho"
            />
            <Resumo
              titulo="Saldo líquido"
              valor={formatBRL(resumo.saldoLiquido)}
              cor={
                resumo.saldoLiquido >= 0
                  ? "text-semaforo-verde"
                  : "text-semaforo-vermelho"
              }
            />
            <Resumo titulo="% do limite" valor={formatPct(resumo.pctUsado)} />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            {labelTipoMei(tenant.tipo_mei)} — limite anual{" "}
            {formatBRL(resumo.limite)} (apenas receitas contam para o limite).
          </p>
        </div>

        {/* Tabela mês a mês */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
            Receitas, despesas e saldo por mês
          </h2>
          <TabelaMensal
            receitasPorMes={resumo.receitasPorMes}
            despesasPorMes={resumo.despesasPorMes}
          />
        </div>

        {/* Ranking de categorias */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">
            Despesas por categoria
          </h2>
          <RankingCategorias ranking={ranking} />
        </div>

        {/* Lançamentos detalhados */}
        <div className="border-t border-gray-100 bg-white px-6 py-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
            Lançamentos detalhados
          </h2>
          <TabelaLancamentos lancamentos={cronologico} completa />
        </div>

        {/* Rodapé */}
        <div className="rounded-b-2xl border-t border-gray-100 bg-white px-6 py-5 text-center text-sm text-gray-400">
          Gerado pelo MEI no Limite — meinolimite.com.br
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
  cor,
}: {
  titulo: string;
  valor: string;
  cor?: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-xs text-gray-400">{titulo}</p>
      <p className={`mt-0.5 text-base font-extrabold ${cor || "text-gray-900"}`}>
        {valor}
      </p>
    </div>
  );
}
