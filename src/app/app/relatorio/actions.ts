"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { calcularResumo } from "@/lib/mei";
import { formatBRL, formatPct, onlyDigits } from "@/lib/format";
import { LIMITE_MEI } from "@/lib/constants";
import type { Lancamento } from "@/lib/types";

export interface GerarRelatorioResult {
  ok: boolean;
  waUrl?: string;
  publicUrl?: string;
  semContador?: boolean;
  error?: string;
}

function baseUrl(): string {
  const h = headers();
  const host = h.get("host") || "meinolimite.com.br";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

/**
 * Gera um relatório: cria um token público, salva em `relatorios` e monta
 * o link wa.me para o contador com a mensagem pré-formatada.
 */
export async function gerarRelatorio(): Promise<GerarRelatorioResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Entre de novo." };

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!tenant) return { ok: false, error: "Cadastro não encontrado." };

  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth() + 1;

  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("mes, valor, tipo")
    .eq("tenant_id", tenant.id)
    .eq("ano", ano);

  const resumo = calcularResumo(
    (lancamentos as Pick<Lancamento, "mes" | "valor" | "tipo">[]) || []
  );

  // Token público (crypto.randomUUID) salvo em relatorios.
  const token = crypto.randomUUID();
  const { error: relErr } = await supabase
    .from("relatorios")
    .insert({ tenant_id: tenant.id, mes, ano, token });

  if (relErr) {
    return { ok: false, error: "Não foi possível gerar o relatório." };
  }

  const publicUrl = `${baseUrl()}/r/${token}`;

  const mensagem =
    `Olá${tenant.nome_contador ? " " + tenant.nome_contador : ""}! ` +
    `Segue o relatório de faturamento do MEI ${tenant.nome} (${ano}).\n\n` +
    `Receitas: ${formatBRL(resumo.totalReceitas)}\n` +
    `Despesas: ${formatBRL(resumo.totalDespesas)}\n` +
    `Saldo líquido: ${formatBRL(resumo.saldoLiquido)}\n` +
    `Limite anual: ${formatBRL(LIMITE_MEI)}\n` +
    `Usado do limite: ${formatPct(resumo.pctUsado)}\n\n` +
    `Relatório completo: ${publicUrl}\n\n` +
    `Enviado pelo MEI no Limite`;

  const numero = onlyDigits(tenant.whatsapp_contador);
  if (!numero) {
    // Sem WhatsApp do contador: ainda retorna o link público para copiar.
    return { ok: true, publicUrl, semContador: true };
  }

  const waUrl = `https://wa.me/55${numero}?text=${encodeURIComponent(
    mensagem
  )}`;

  return { ok: true, waUrl, publicUrl };
}
