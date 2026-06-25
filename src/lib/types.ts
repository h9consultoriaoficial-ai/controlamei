export type TipoAtividade = "comercio" | "servico" | "misto";

export interface Tenant {
  id: string;
  nome: string;
  cpf: string;
  whatsapp: string | null;
  nome_contador: string | null;
  whatsapp_contador: string | null;
  tipo_atividade: TipoAtividade | null;
  plano: string;
  user_id: string;
  created_at: string;
}

export interface Lancamento {
  id: string;
  tenant_id: string;
  mes: number;
  ano: number;
  valor: number;
  created_at: string;
}

export interface Relatorio {
  id: string;
  tenant_id: string;
  mes: number | null;
  ano: number | null;
  token: string;
  created_at: string;
}
