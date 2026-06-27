import { createClient } from "@supabase/supabase-js";

/**
 * Leitura PÚBLICA dos contadores de vagas de Fundador.
 *
 * Usa um cliente anônimo SEM cookies (não o server client baseado em
 * cookies) de propósito: a landing usa ISR (revalidate = 60) e um cliente
 * dependente de cookies forçaria renderização dinâmica por request,
 * derrubando o cache. A leitura é pública (policy "leitura publica"),
 * então a anon key basta.
 *
 * Resiliente: se a tabela ainda não existir (migration não rodada) ou a
 * query falhar, cai no FALLBACK e a página nunca quebra.
 */
const FALLBACK = { total: 300, restantes: 300 };

export async function buscarVagasRestantes(): Promise<{
  total: number;
  restantes: number;
}> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await supabase
      .from("configuracoes")
      .select("chave, valor")
      .in("chave", ["vagas_fundador_total", "vagas_fundador_usadas"]);

    if (error || !data || data.length === 0) return FALLBACK;

    const map = new Map(data.map((r) => [r.chave, Number(r.valor)]));
    const total = Number.isFinite(map.get("vagas_fundador_total"))
      ? (map.get("vagas_fundador_total") as number)
      : 300;
    const usadas = Number.isFinite(map.get("vagas_fundador_usadas"))
      ? (map.get("vagas_fundador_usadas") as number)
      : 0;

    return { total, restantes: Math.max(0, total - usadas) };
  } catch {
    return FALLBACK;
  }
}
