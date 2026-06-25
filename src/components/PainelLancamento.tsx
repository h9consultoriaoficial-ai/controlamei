"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FORMAS_PAGAMENTO } from "@/lib/constants";
import { formatBRL, maskMoeda, moedaParaNumero } from "@/lib/format";
import { lancar, criarCategoria } from "@/app/actions/lancamentos";
import type { CategoriaOption, TipoLancamento } from "@/lib/types";

function hojeLocal(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function PainelLancamento({
  categorias: categoriasIniciais,
}: {
  categorias: CategoriaOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [data, setData] = useState(hojeLocal());
  const [valorTexto, setValorTexto] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [nomeParte, setNomeParte] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [descricao, setDescricao] = useState("");

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

  const ehReceita = tipo === "receita";
  const labelParte = ehReceita ? "Cliente" : "Fornecedor";

  function trocarTipo(novo: TipoLancamento) {
    setTipo(novo);
    setMsg(null);
  }

  function handleLancar() {
    const valor = moedaParaNumero(valorTexto);
    if (!data) {
      setMsg({ tipo: "erro", texto: "Informe a data." });
      return;
    }
    if (!valorTexto.trim() || valor <= 0) {
      setMsg({ tipo: "erro", texto: "Digite o valor." });
      return;
    }
    if (!formaPagamento) {
      setMsg({ tipo: "erro", texto: "Escolha a forma de pagamento." });
      return;
    }
    if (tipo === "despesa" && !categoriaId) {
      setMsg({ tipo: "erro", texto: "Escolha a categoria da despesa." });
      return;
    }
    setMsg(null);

    startTransition(async () => {
      const res = await lancar({
        tipo,
        valor,
        categoriaId: tipo === "despesa" ? categoriaId : null,
        data,
        formaPagamento,
        nomeParte,
        numeroDocumento,
        descricao,
      });
      if (res.ok) {
        // Mantém data/forma/tipo para lançar vários seguidos; limpa o resto.
        setValorTexto("");
        setNomeParte("");
        setNumeroDocumento("");
        setDescricao("");
        setMsg({
          tipo: "ok",
          texto: `${ehReceita ? "Receita" : "Despesa"} de ${formatBRL(
            valor
          )} salva.`,
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

      {/* Categoria (só despesa) */}
      {!ehReceita && (
        <div className="mb-4">
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

      <div className="flex flex-col gap-4">
        {/* CAMPO 1 — Data */}
        <div>
          <label className="label-field" htmlFor="data">
            Data
          </label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* CAMPO 2 — Valor */}
        <div>
          <label className="label-field" htmlFor="valor">
            Valor
          </label>
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
              placeholder="0,00"
              className="input-field py-4 pl-12 text-2xl font-bold"
            />
          </div>
        </div>

        {/* CAMPO 3 — Forma de pagamento */}
        <div>
          <label className="label-field" htmlFor="forma">
            Forma de pagamento
          </label>
          <select
            id="forma"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="input-field"
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            {FORMAS_PAGAMENTO.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* CAMPO 4 — Cliente / Fornecedor */}
        <div>
          <label className="label-field" htmlFor="parte">
            {labelParte}
          </label>
          <input
            id="parte"
            type="text"
            maxLength={100}
            value={nomeParte}
            onChange={(e) => setNomeParte(e.target.value)}
            placeholder="Nome (opcional)"
            className="input-field"
          />
        </div>

        {/* CAMPO 5 — Nº do recibo / NF */}
        <div>
          <label className="label-field" htmlFor="documento">
            Nº do recibo / NF
          </label>
          <input
            id="documento"
            type="text"
            maxLength={50}
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            placeholder="ex: 000123 (opcional)"
            className="input-field"
          />
        </div>

        {/* CAMPO 6 — Descrição */}
        <div>
          <label className="label-field" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            rows={2}
            maxLength={200}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Observação (opcional)"
            className="input-field resize-none"
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
