export type TipoAtividade = "comercio" | "servico" | "misto";
export type TipoLancamento = "receita" | "despesa";
export type TipoMei = "mei" | "mei_caminhoneiro";

export interface Tenant {
  id: string;
  nome: string;
  cpf: string;
  whatsapp: string | null;
  nome_contador: string | null;
  whatsapp_contador: string | null;
  tipo_atividade: TipoAtividade | null;
  tipo_mei: TipoMei;
  plano: string;
  user_id: string;
  created_at: string;
}

export interface CategoriaDespesa {
  id: string;
  tenant_id: string;
  nome: string;
  icone: string | null;
  is_padrao: boolean;
  created_at: string;
}

/** Versão enxuta usada no front (select de categoria). */
export interface CategoriaOption {
  id: string;
  nome: string;
  icone: string | null;
}

export interface Lancamento {
  id: string;
  tenant_id: string;
  mes: number;
  ano: number;
  valor: number;
  tipo: TipoLancamento;
  categoria_id: string | null;
  data_lancamento: string | null;
  forma_pagamento: string | null;
  nome_parte: string | null;
  numero_documento: string | null;
  descricao: string | null;
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
