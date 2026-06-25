/** Limites anuais de faturamento por tipo de MEI. */
export const MEI_LIMITE = 81000;
export const MEI_CAMINHONEIRO_LIMITE = 251600;

export type TipoMei = "mei" | "mei_caminhoneiro";

export const TIPOS_MEI = [
  { value: "mei", label: "MEI Padrão", limite: MEI_LIMITE },
  {
    value: "mei_caminhoneiro",
    label: "MEI Caminhoneiro",
    limite: MEI_CAMINHONEIRO_LIMITE,
  },
] as const;

/** Limite anual conforme o tipo de MEI. */
export function getLimite(tipo_mei: string): number {
  return tipo_mei === "mei_caminhoneiro"
    ? MEI_CAMINHONEIRO_LIMITE
    : MEI_LIMITE;
}

/** Limite + 20% (faixa crítica / tolerância de excesso). */
export function getLimite20(tipo_mei: string): number {
  return getLimite(tipo_mei) * 1.2;
}

/** Rótulo amigável do tipo de MEI. */
export function labelTipoMei(tipo_mei: string): string {
  return tipo_mei === "mei_caminhoneiro" ? "MEI Caminhoneiro" : "MEI Padrão";
}

/** Percentuais de alerta do semáforo. */
export const ALERTA_AMARELO = 80; // % do limite
export const ALERTA_VERMELHO = 100; // % do limite
export const ALERTA_CRITICO = 120; // % do limite (alerta especial)

export const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export const MESES_LONGOS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const TIPOS_ATIVIDADE = [
  { value: "comercio", label: "Comércio" },
  { value: "servico", label: "Serviço" },
  { value: "misto", label: "Misto (comércio + serviço)" },
] as const;

/** Formas de pagamento aceitas no lançamento. */
export const FORMAS_PAGAMENTO = [
  "PIX",
  "Dinheiro",
  "Cartão débito",
  "Cartão crédito",
  "Boleto",
  "Outros",
] as const;

/**
 * Categorias de despesa padrão, criadas por tenant no cadastro.
 * NÃO são globais — cada MEI recebe a sua cópia (isolamento multi-tenant).
 */
export const CATEGORIAS_PADRAO: { nome: string; icone: string }[] = [
  // Fixas
  { nome: "Aluguel", icone: "🏠" },
  { nome: "Conta de luz", icone: "💡" },
  { nome: "Conta de água", icone: "🚰" },
  { nome: "Internet", icone: "🌐" },
  { nome: "Telefone/celular", icone: "📱" },
  { nome: "DAS", icone: "🧾" },
  { nome: "Contador/assessoria", icone: "📊" },
  // Variáveis
  { nome: "Compra de estoque", icone: "📦" },
  { nome: "Matéria-prima", icone: "🧱" },
  { nome: "Embalagens", icone: "🎁" },
  { nome: "Transporte/combustível", icone: "⛽" },
  { nome: "Frete (envio de produtos)", icone: "🚚" },
  { nome: "Despesas com caminhão", icone: "🚛" },
  { nome: "Passagens intermunicipal", icone: "🚌" },
  { nome: "Pagamento de fretes para terceiros", icone: "💸" },
  { nome: "Marketing", icone: "📣" },
  { nome: "Equipamentos", icone: "🖥️" },
  { nome: "Manutenção", icone: "🔧" },
  // Outras
  { nome: "Alimentação", icone: "🍽️" },
  { nome: "Cursos e capacitação", icone: "🎓" },
  { nome: "Outros", icone: "➕" },
];
