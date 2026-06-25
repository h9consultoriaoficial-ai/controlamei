"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MESES_CURTOS, MESES_LONGOS } from "@/lib/constants";
import { formatBRL, parseValorInput } from "@/lib/format";
import { lancar } from "@/app/app/actions";

export default function PainelLancamento({
  ano,
  valoresPorMes,
  mesAtual,
}: {
  ano: number;
  valoresPorMes: number[];
  mesAtual: number; // 1-12
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [valorTexto, setValorTexto] = useState("");
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null
  );

  const valorAtualDoMes = valoresPorMes[mesSelecionado - 1] || 0;

  function selecionarMes(mes: number) {
    setMesSelecionado(mes);
    setValorTexto("");
    setMsg(null);
  }

  function handleLancar() {
    const valor = parseValorInput(valorTexto);
    if (!valorTexto.trim() || valor <= 0) {
      setMsg({ tipo: "erro", texto: "Digite o valor faturado no mês." });
      return;
    }
    setMsg(null);
    startTransition(async () => {
      const res = await lancar({ mes: mesSelecionado, ano, valor });
      if (res.ok) {
        setValorTexto("");
        setMsg({
          tipo: "ok",
          texto: `${MESES_LONGOS[mesSelecionado - 1]} salvo: ${formatBRL(
            valor
          )}`,
        });
        router.refresh();
      } else {
        setMsg({ tipo: "erro", texto: res.error || "Erro ao salvar." });
      }
    });
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-900">Lançar faturamento</h2>
      <p className="text-sm text-gray-500">
        Toque no mês e digite quanto faturou.
      </p>

      {/* Grid de 12 meses */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {MESES_CURTOS.map((nome, i) => {
          const mes = i + 1;
          const ativo = mes === mesSelecionado;
          const temValor = (valoresPorMes[i] || 0) > 0;
          return (
            <button
              key={mes}
              type="button"
              onClick={() => selecionarMes(mes)}
              className={`flex flex-col items-center rounded-xl border-2 px-1 py-2.5 transition-colors ${
                ativo
                  ? "border-primary bg-primary text-white"
                  : temValor
                  ? "border-primary-light bg-primary-light text-primary"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <span className="text-sm font-bold">{nome}</span>
              <span
                className={`mt-0.5 text-[10px] leading-tight ${
                  ativo ? "text-white/90" : "text-gray-500"
                }`}
              >
                {temValor ? formatBRL(valoresPorMes[i]) : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input do valor */}
      <div className="mt-5">
        <label className="label-field" htmlFor="valor">
          Faturamento de {MESES_LONGOS[mesSelecionado - 1]}/{ano}
        </label>
        {valorAtualDoMes > 0 && (
          <p className="mb-1.5 text-xs text-gray-500">
            Valor atual: {formatBRL(valorAtualDoMes)} — digite para substituir.
          </p>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
            R$
          </span>
          <input
            id="valor"
            inputMode="decimal"
            value={valorTexto}
            onChange={(e) => setValorTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLancar();
            }}
            placeholder="0,00"
            className="input-field py-4 pl-12 text-2xl font-bold"
          />
        </div>
      </div>

      {msg && (
        <div
          className={`mt-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
            msg.tipo === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.texto}
        </div>
      )}

      <button
        type="button"
        onClick={handleLancar}
        disabled={pending}
        className="btn-primary mt-4 w-full text-lg"
      >
        {pending ? "Salvando..." : "Lançar"}
      </button>
    </div>
  );
}
