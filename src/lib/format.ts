/** Formata um número como moeda brasileira (R$ 1.234,56). */
export function formatBRL(valor: number): string {
  return (valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Formata um percentual com no máximo 1 casa decimal. */
export function formatPct(pct: number): string {
  return `${(pct || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

/**
 * Converte texto digitado pelo usuário em número.
 * Aceita "1.500,50", "1500,50", "1500.50", "1500" e "R$ 1.500".
 */
export function parseValorInput(input: string): number {
  if (!input) return 0;
  let s = input.replace(/[^0-9.,]/g, "").trim();
  if (!s) return 0;

  const temVirgula = s.includes(",");
  const temPonto = s.includes(".");

  if (temVirgula && temPonto) {
    // Formato BR: ponto = milhar, vírgula = decimal
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (temVirgula) {
    // Só vírgula = decimal
    s = s.replace(",", ".");
  }
  // Só ponto: assume que já é decimal (1500.50)

  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

/** Remove tudo que não for dígito (para montar link wa.me). */
export function onlyDigits(s: string | null | undefined): string {
  return (s || "").replace(/\D/g, "");
}

/**
 * Aplica máscara de telefone brasileiro em tempo real: (19) 99955-1747.
 * Aceita só dígitos (até 11) e formata progressivamente conforme o usuário
 * digita. Para salvar no banco, use onlyDigits() no valor.
 */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  // 11 dígitos (celular): (XX) XXXXX-XXXX
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Máscara de moeda em tempo real (centavos da direita p/ esquerda).
 * Ex.: digita "485200" -> "4.852,00". Retorna só a parte numérica
 * formatada (o "R$" fica no layout). Use moedaParaNumero() para salvar.
 */
export function maskMoeda(value: string): string {
  const d = onlyDigits(value);
  if (!d) return "";
  const cents = parseInt(d, 10);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Converte o texto mascarado de moeda em número (ex.: "4.852,00" -> 4852). */
export function moedaParaNumero(masked: string): number {
  const d = onlyDigits(masked);
  if (!d) return 0;
  return parseInt(d, 10) / 100;
}

/** Formata uma data "YYYY-MM-DD" como "DD/MM/AAAA". Retorna "—" se vazia. */
export function formatData(data: string | null | undefined): string {
  if (!data) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);
  if (!m) return data;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Mascara um CPF (000.000.000-00) se tiver 11 dígitos. */
export function formatCPF(cpf: string | null | undefined): string {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return cpf || "";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
