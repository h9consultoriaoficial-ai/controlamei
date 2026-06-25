/** Limite anual de faturamento do MEI (R$ 81.000,00). */
export const LIMITE_MEI = 81000;

/** Percentuais de alerta do semáforo. */
export const ALERTA_AMARELO = 80; // % do limite
export const ALERTA_VERMELHO = 100; // % do limite

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
