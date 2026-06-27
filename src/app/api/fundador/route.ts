import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/fundador
 * Incrementa o contador de vagas de Fundador usadas. Deve ser chamado
 * APÓS a confirmação de pagamento (webhook do gateway), nunca direto do
 * cliente. Usa service role (bypass de RLS) — `configuracoes` só é
 * gravável por service role.
 *
 * Retorna { restantes: number }.
 *
 * Observação: o incremento é read-then-write (não atômico). Como é
 * chamado uma vez por pagamento confirmado, a chance de corrida é
 * desprezível. Se o volume crescer, trocar por uma função RPC atômica
 * (update ... set valor = (valor::int + 1)::text).
 */
export async function POST() {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("configuracoes")
      .select("chave, valor")
      .in("chave", ["vagas_fundador_total", "vagas_fundador_usadas"]);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Configuração de vagas indisponível." },
        { status: 500 }
      );
    }

    const map = new Map(data.map((r) => [r.chave, Number(r.valor)]));
    const total = Number(map.get("vagas_fundador_total")) || 300;
    const usadas = (Number(map.get("vagas_fundador_usadas")) || 0) + 1;

    const { error: upErr } = await admin
      .from("configuracoes")
      .update({ valor: String(usadas), updated_at: new Date().toISOString() })
      .eq("chave", "vagas_fundador_usadas");

    if (upErr) {
      return NextResponse.json(
        { error: "Não foi possível atualizar o contador." },
        { status: 500 }
      );
    }

    return NextResponse.json({ restantes: Math.max(0, total - usadas) });
  } catch {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
