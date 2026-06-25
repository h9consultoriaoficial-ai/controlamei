"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { onlyDigits } from "@/lib/format";
import type { TipoAtividade } from "@/lib/types";

export interface CadastroState {
  error?: string;
}

const TIPOS_VALIDOS: TipoAtividade[] = ["comercio", "servico", "misto"];

export async function cadastrar(
  _prev: CadastroState,
  formData: FormData
): Promise<CadastroState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");
  const nome = String(formData.get("nome") || "").trim();
  const cpf = onlyDigits(String(formData.get("cpf") || ""));
  const whatsapp = onlyDigits(String(formData.get("whatsapp") || ""));
  const nome_contador = String(formData.get("nome_contador") || "").trim();
  const whatsapp_contador = onlyDigits(
    String(formData.get("whatsapp_contador") || "")
  );
  const tipo_atividade = String(
    formData.get("tipo_atividade") || ""
  ) as TipoAtividade;

  // Validações simples (público com pouca instrução -> mensagens claras)
  if (!nome) return { error: "Digite seu nome." };
  if (!email || !email.includes("@"))
    return { error: "Digite um e-mail válido." };
  if (senha.length < 6)
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  if (cpf.length !== 11) return { error: "Digite um CPF válido (11 dígitos)." };
  if (!TIPOS_VALIDOS.includes(tipo_atividade))
    return { error: "Escolha o tipo de atividade." };

  const admin = createAdminClient();

  // 1) Cria o usuário já confirmado (sem fricção de e-mail para o público-alvo).
  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome },
  });

  if (userErr || !created?.user) {
    const msg = userErr?.message?.toLowerCase() || "";
    if (msg.includes("already") || msg.includes("registered")) {
      return { error: "Este e-mail já está cadastrado. Tente entrar." };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  const userId = created.user.id;

  // 2) Cria o tenant (MEI) vinculado ao user_id recém-criado (via service role).
  const { error: tenantErr } = await admin.from("tenants").insert({
    nome,
    cpf,
    whatsapp,
    nome_contador,
    whatsapp_contador,
    tipo_atividade,
    user_id: userId,
  });

  if (tenantErr) {
    // Rollback: remove o usuário órfão para permitir nova tentativa.
    await admin.auth.admin.deleteUser(userId);
    if (tenantErr.code === "23505") {
      return { error: "Este CPF já está cadastrado." };
    }
    return { error: "Erro ao salvar seus dados. Tente novamente." };
  }

  // 3) Cria a sessão (grava cookies) para já entrar logado.
  const supabase = createClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (signInErr) {
    // Conta criada, mas login falhou: manda para a tela de login.
    redirect("/login?cadastrado=1");
  }

  redirect("/app");
}
