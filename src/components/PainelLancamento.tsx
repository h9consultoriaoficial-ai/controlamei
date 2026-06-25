"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MESES_CURTOS, MESES_LONGOS } from "@/lib/constants";
import { formatBRL, maskMoeda, moedaParaNumero } from "@/lib/format";
import { lancar, criarCategoria } from "@/app/app/actions";
import type { CategoriaOption, TipoLancamento } from "@/lib/types";

export default function PainelLancamento({
  ano,
  receitasPorMes,
  mesAtual,
  categorias: categoriasIniciais,
}: {
  ano: number;
  receitasPorMes: number[];
  mesAtual: number; // 1-12
  categorias: CategoriaOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [valorTexto, setValorTexto] = useState("");
  const [categorias, setCategorias] =
    useState<CategoriaOption[]>(categoriasIniciais);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null
  );

  // Modal de nova categoria
  const [modalAberto, setModalAberto] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [salvandoCat, startCatTransition] = useTransition();
  const [catErro, setCatErro] = useState<string | null>(null);

  const valorAtualDoMes = receitasPorMes[mesSelecionado - 1] || 0;

  function selecionarMes(mes: number) {
    setMesSelecionado(mes);
    setValorTexto("");
    setMsg(null);
  }

  function trocarTipo(novo: TipoLancamento) {
    setTipo(novo);
    setValorTexto("");
    setMsg(null);
  }

  function handleLancar() {
    const valor = moedaParaNumero(valorTexto);
    if (!valorTexto.trim() || valor <= 0) {
      setMsg({ tipo: "erro", texto: "Digite o valor." });
      return;
    }
    if (tipo === "despesa" && !categoriaId) {
      setMsg({ tipo: "erro", texto: "Escolha a categoria da despesa." });
      return;
    }
    setMsg(null);

    startTransition(async () => {
      const res = await lancar({
        mes: mesSelecionado,
        ano,
        valor,
        tipo,
        categoriaId: tipo === "despesa" ? categoriaId : null,
      });
      if (res.ok) {
        setValorTexto("");
        const mesNome = MESES_LONGOS[mesSelecionado - 1];
        setMsg({
          tipo: "ok",
          texto:
            tipo === "receita"
              ? `Receita de ${mesNome} salva: ${formatBRL(valor)}`
              : `Despesa de ${mesNome} salva: ${formatBRL(valor)}`,
        });
        router.refresh();
      } else {
        setMsg({ tipo: "erro", texto: res.error || "Erro ao salvar." });
      }
    });
  }

  function handleCriarCategoria() {
    const nome = novaCategoria.trim();
    if (nome.length < 2) {
      setCatErro("Digite um nome.");
      return;
    }
    setCatErro(null);
    startCatTransition(async () => {
      const res = await criarCategoria(nome);
      if (res.ok && res.categoria) {
        const nova = res.categoria;
        setCategorias((prev) =>
          [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        );
        setCategoriaId(nova.id);
        setNovaCategoria("");
        setModalAberto(false);
      } else {
        setCatErro(res.error || "Erro ao criar categoria.");
      }
    });
  }

  const ehReceita = tipo === "receita";

  return (
    <div className="card">
      {/* Toggle Receita | Despesa */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => trocarTipo("receita")}
          className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${
            ehReceita ? "bg-semaforo-verde text-white shadow-sm" : "text-gray-500"
          }`}
        >
          ↑ Receita
        </button>
        <button
          type="button"
          onClick={() => trocarTipo("despesa")}
          className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${
            !ehReceita
              ? "bg-semaforo-vermelho text-white shadow-sm"
              : "text-gray-500"
          }`}
        >
          ↓ Despesa
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {ehReceita
          ? "Toque no mês e digite quanto faturou."
          : "Escolha o mês, a categoria e o valor gasto."}
      </p>

      {/* Grid de 12 meses */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {MESES_CURTOS.map((nome, i) => {
          const mes = i + 1;
          const ativo = mes === mesSelecionado;
          const temValor = (receitasPorMes[i] || 0) > 0;
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
                {temValor ? formatBRL(receitasPorMes[i]) : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categoria (só despesa) */}
      {!ehReceita && (
        <div className="mt-5">
          <label className="label-field" htmlFor="categoria">
            Categoria da despesa
          </label>
          <div className="flex gap-2">
            <select
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="input-field flex-1"
            >
              <option value="" disabled>
                Escolha...
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icone ? `${c.icone} ` : ""}
                  {c.nome}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setCatErro(null);
                setNovaCategoria("");
                setModalAberto(true);
              }}
              className="btn-outline whitespace-nowrap px-4 py-3"
            >
              ＋ Nova
            </button>
          </div>
        </div>
      )}

      {/* Input do valor */}
      <div className="mt-5">
        <label className="label-field" htmlFor="valor">
          {ehReceita ? "Faturamento" : "Valor da despesa"} de{" "}
          {MESES_LONGOS[mesSelecionado - 1]}/{ano}
        </label>
        {ehReceita && valorAtualDoMes > 0 && (
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
            type="text"
            inputMode="numeric"
            value={valorTexto}
            onInput={(e) =>
              setValorTexto(maskMoeda((e.target as HTMLInputElement).value))
            }
            onChange={(e) => setValorTexto(maskMoeda(e.target.value))}
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
        className={`mt-4 w-full rounded-xl px-6 py-3.5 text-lg font-semibold text-white transition-colors disabled:opacity-60 ${
          ehReceita
            ? "bg-semaforo-verde hover:brightness-95"
            : "bg-semaforo-vermelho hover:brightness-95"
        }`}
      >
        {pending ? "Salvando..." : ehReceita ? "Lançar receita" : "Lançar despesa"}
      </button>

      {/* Modal inline de nova categoria */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => !salvandoCat && setModalAberto(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">Nova categoria</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie uma categoria de despesa sua.
            </p>
            <input
              autoFocus
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCriarCategoria();
              }}
              placeholder="Ex.: Frete, Software..."
              className="input-field mt-4"
            />
            {catErro && (
              <p className="mt-2 text-sm font-medium text-red-600">{catErro}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={salvandoCat}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCriarCategoria}
                disabled={salvandoCat}
                className="btn-primary flex-1"
              >
                {salvandoCat ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
