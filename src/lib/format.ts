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

/** Mascara um CPF (000.000.000-00) se tiver 11 dígitos. */
export function formatCPF(cpf: string | null | undefined): string {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return cpf || "";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
