import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { garantirCategoriasPadrao } from "@/lib/categorias";

export const dynamic = "force-dynamic";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://www.meinolimite.com.br";

/**
 * Webhook da Cakto — provisiona o acesso após compra aprovada.
 *
 * Fluxo: valida segredo -> confirma que é compra aprovada -> cria usuário
 * (Auth) -> cria tenant (plano 'pro') -> categorias padrão -> incrementa
 * vagas usadas -> e-mail de boas-vindas.
 *
 * Idempotência: a Cakto reenvia em caso de não-2xx. Se o usuário já existe,
 * tratamos como sucesso (não reprocessa). Erros REAIS de provisionamento
 * retornam 500 para a Cakto retentar. Passos pós-provisionamento
 * (categorias, contador, e-mail) são best-effort e NÃO derrubam o webhook —
 * a conta paga já existe; não faz sentido reprocessar tudo por causa deles.
 */
export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    console.error("[cakto] body inválido (não-JSON)");
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  // a) Verifica a chave secreta (header OU body)
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[cakto] CAKTO_WEBHOOK_SECRET não configurada");
    return NextResponse.json({ error: "configuração ausente" }, { status: 500 });
  }
  const recebido =
    req.headers.get("x-cakto-signature") ||
    req.headers.get("x-webhook-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    pick(payload, ["secret", "token", "webhookSecret", "data.secret"]) ||
    "";
  if (recebido !== secret) {
    console.error("[cakto] chave secreta inválida");
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  // Só processa compra aprovada; demais eventos são reconhecidos e ignorados (200).
  if (!isAprovado(payload)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // b) Extrai dados do comprador (paths defensivos — shape da Cakto pode variar)
  const email = (
    pick(payload, [
      "data.customer.email",
      "customer.email",
      "data.buyer.email",
      "buyer.email",
      "data.email",
      "email",
    ]) || ""
  ).toLowerCase();
  const nome =
    pick(payload, [
      "data.customer.name",
      "customer.name",
      "data.buyer.name",
      "buyer.name",
      "data.name",
      "name",
    ]) || "Cliente MEI no Limite";
  const cpf = onlyDigits(
    pick(payload, [
      "data.customer.docNumber",
      "data.customer.document",
      "customer.document",
      "customer.docNumber",
      "data.customer.cpf",
      "customer.cpf",
      "data.document",
      "document",
      "data.buyer.document",
    ])
  );

  if (!email || !email.includes("@")) {
    console.error("[cakto] e-mail ausente/inválido em evento aprovado");
    return NextResponse.json({ error: "e-mail ausente" }, { status: 500 });
  }

  const admin = createAdminClient();

  try {
    // c) Cria o usuário no Supabase Auth (senha temporária aleatória)
    const { data: created, error: userErr } = await admin.auth.admin.createUser({
      email,
      password: crypto.randomUUID(),
      email_confirm: true,
      user_metadata: { nome, origem: "cakto" },
    });

    if (userErr) {
      const msg = (userErr.message || "").toLowerCase();
      // Idempotência: retry da Cakto para uma compra já provisionada.
      if (
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists")
      ) {
        console.warn(`[cakto] usuário já existe (${email}) — retry idempotente`);
        return NextResponse.json({ ok: true, idempotent: true });
      }
      console.error("[cakto] erro ao criar usuário:", userErr.message);
      return NextResponse.json({ error: "falha ao criar usuário" }, { status: 500 });
    }

    const userId = created!.user.id;

    // d) Cria o tenant (plano 'pro') — via service role
    const { data: tenant, error: tenantErr } = await admin
      .from("tenants")
      .insert({
        nome,
        cpf: cpf || null,
        user_id: userId,
        plano: "pro",
      })
      .select("id")
      .single();

    if (tenantErr || !tenant) {
      // Rollback do usuário órfão para o retry da Cakto poder recriar.
      await admin.auth.admin.deleteUser(userId);
      console.error("[cakto] erro ao criar tenant:", tenantErr?.message);
      return NextResponse.json({ error: "falha ao criar tenant" }, { status: 500 });
    }

    // e) Categorias padrão (best-effort)
    try {
      await garantirCategoriasPadrao(admin, tenant.id);
    } catch (e) {
      console.warn("[cakto] falha ao semear categorias (não-fatal):", e);
    }

    // f) Incrementa vagas_fundador_usadas (best-effort)
    try {
      const { data: cfg } = await admin
        .from("configuracoes")
        .select("valor")
        .eq("chave", "vagas_fundador_usadas")
        .maybeSingle();
      const usadas = (Number(cfg?.valor) || 0) + 1;
      await admin
        .from("configuracoes")
        .update({ valor: String(usadas), updated_at: new Date().toISOString() })
        .eq("chave", "vagas_fundador_usadas");
    } catch (e) {
      console.warn("[cakto] falha ao incrementar vagas (não-fatal):", e);
    }

    // g) E-mail de boas-vindas (best-effort)
    await enviarBoasVindas(email, nome);

    // h) ok
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[cakto] erro inesperado:", e);
    return NextResponse.json({ error: "erro inesperado" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Busca um valor string/number percorrendo caminhos "a.b.c" no payload. */
function pick(
  obj: unknown,
  paths: string[]
): string | undefined {
  for (const p of paths) {
    const val = p.split(".").reduce<unknown>((o, k) => {
      if (o && typeof o === "object") return (o as Record<string, unknown>)[k];
      return undefined;
    }, obj);
    if (typeof val === "string" && val.trim()) return val.trim();
    if (typeof val === "number") return String(val);
  }
  return undefined;
}

function onlyDigits(s?: string): string {
  return (s || "").replace(/\D/g, "");
}

/** Detecta compra aprovada por status OU tipo de evento. */
function isAprovado(payload: unknown): boolean {
  const status = (
    pick(payload, [
      "data.status",
      "status",
      "data.payment.status",
      "payment.status",
      "data.order.status",
      "order.status",
    ]) || ""
  ).toLowerCase();
  const event = (
    pick(payload, ["event", "type", "data.event", "evento"]) || ""
  ).toLowerCase();

  const statusOk = ["paid", "approved", "aprovad", "completed", "active"];
  const eventOk = [
    "purchase_approved",
    "purchase.approved",
    "compra_aprovada",
    "order.paid",
    "payment.approved",
    "pix.paid",
    "subscription_created",
  ];
  return (
    statusOk.some((s) => status.includes(s)) ||
    eventOk.some((e) => event.includes(e))
  );
}

/** E-mail de boas-vindas via API do Resend (best-effort). */
async function enviarBoasVindas(email: string, nome: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ||
    "MEI no Limite <nao-responda@meinolimite.com.br>";

  if (!apiKey) {
    console.warn(
      "[cakto] RESEND_API_KEY ausente — e-mail de boas-vindas não enviado"
    );
    return;
  }

  const primeiroNome = nome.split(" ")[0] || "tudo certo";
  const link = `${APP_URL}/recuperar-senha`;
  const html = `
  <div style="margin:0;padding:0;background:#0F172A;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#162033;border:1px solid #334155;border-radius:16px;overflow:hidden;">
          <tr><td align="center" style="padding:28px 28px 8px;">
            <img src="${APP_URL}/icon-192.png" width="64" height="64" alt="MEI no Limite" style="display:block;border-radius:14px;" />
            <div style="color:#16A34A;font-size:20px;font-weight:800;margin-top:12px;">MEI no Limite</div>
          </td></tr>
          <tr><td style="padding:8px 28px 0;color:#E2E8F0;">
            <h1 style="font-size:22px;margin:16px 0 8px;color:#ffffff;">Seu acesso está pronto, ${primeiroNome}! 🚦</h1>
            <p style="font-size:15px;line-height:1.6;color:#94A3B8;margin:0 0 8px;">
              Pagamento confirmado. Sua conta no <b style="color:#E2E8F0;">MEI no Limite</b> já foi criada.
            </p>
            <p style="font-size:15px;line-height:1.6;color:#94A3B8;margin:0 0 20px;">
              Clique no botão abaixo para <b style="color:#E2E8F0;">definir sua senha</b> no primeiro acesso:
            </p>
          </td></tr>
          <tr><td align="center" style="padding:0 28px 8px;">
            <a href="${link}" style="display:inline-block;background:#16A34A;color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:12px;">
              Acessar e definir minha senha
            </a>
          </td></tr>
          <tr><td style="padding:14px 28px 0;color:#64748B;font-size:12px;line-height:1.6;">
            <p style="margin:0;">Se o botão não funcionar, copie e cole no navegador:<br />
              <a href="${link}" style="color:#94A3B8;">${link}</a>
            </p>
          </td></tr>
          <tr><td style="padding:24px 28px;border-top:1px solid #334155;margin-top:16px;color:#64748B;font-size:12px;">
            MEI no Limite — by H9 Consultoria<br />
            meinolimite.com.br
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Seu acesso ao MEI no Limite está pronto!",
        html,
      }),
    });
    if (!res.ok) {
      console.error("[cakto] Resend falhou:", res.status, await res.text());
    }
  } catch (e) {
    console.error("[cakto] erro ao enviar e-mail:", e);
  }
}
