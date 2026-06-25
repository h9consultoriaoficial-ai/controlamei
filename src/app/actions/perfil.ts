"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { onlyDigits } from "@/lib/format";
import type { TipoAtividade, TipoMei } from "@/lib/types";

export interface AtualizarPerfilResult {
  sucesso?: true;
  erro?: string;
}

const ATIVIDADES_VALIDAS: TipoAtividade[] = ["comercio", "servico", "misto"];
const TIPOS_MEI_VALIDOS: TipoMei[] = ["mei", "mei_caminhoneiro"];

/**
 * Atualiza os dados do tenant (MEI) do usuário logado.
 * Segurança: o user_id vem SEMPRE da sessão (getUser), nunca do cliente.
 * A escrita usa service role escopada por esse user_id.
 * Campos não editáveis (email, cpf) não são tocados aqui.
 */
export async function atualizarPerfil(dados: {
  nome: string;
  whatsapp: string;
  tipo_mei: string;
  tipo_atividade: string;
  nome_contador: string;
  whatsapp_contador: string;
}): Promise<AtualizarPerfilResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sessão expirada. Entre de novo." };

  const nome = (dados.nome || "").trim();
  if (!nome) return { erro: "Digite seu nome." };

  const tipo_mei: TipoMei =
    dados.tipo_mei === "mei_caminhoneiro" ? "mei_caminhoneiro" : "mei";
  if (!TIPOS_MEI_VALIDOS.includes(tipo_mei))
    return { erro: "Tipo de MEI inválido." };

  const tipo_atividade = dados.tipo_atividade as TipoAtividade;
  if (!ATIVIDADES_VALIDAS.includes(tipo_atividade))
    return { erro: "Tipo de atividade inválido." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("tenants")
    .update({
      nome,
      whatsapp: onlyDigits(dados.whatsapp),
      tipo_mei,
      tipo_atividade,
      nome_contador: (dados.nome_contador || "").trim(),
      whatsapp_contador: onlyDigits(dados.whatsapp_contador),
    })
    .eq("user_id", user.id); // escopo de segurança

  if (error) {
    return { erro: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/app");
  revalidatePath("/app/perfil");
  revalidatePath("/app/historico");
  revalidatePath("/app/relatorio");
  return { sucesso: true };
}
