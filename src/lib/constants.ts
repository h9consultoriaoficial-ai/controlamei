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
