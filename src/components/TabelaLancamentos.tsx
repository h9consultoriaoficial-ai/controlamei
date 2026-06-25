import { formatBRL, formatData } from "@/lib/format";
import type { LancamentoDetalhe } from "@/lib/dados";

const ou = (v: string | null | undefined) => (v && v.trim() ? v : "—");

/**
 * Tabela de lançamentos individuais.
 *  - compacta (padrão): Data | Tipo | Cliente/Fornecedor | Forma pgto | Valor | Documento
 *  - completa: + Categoria (após Tipo) e Descrição (no fim)
 * Receitas em verde, despesas em vermelho. Rola horizontal no mobile.
 */
export default function TabelaLancamentos({
  lancamentos,
  completa = false,
}: {
  lancamentos: LancamentoDetalhe[];
  completa?: boolean;
}) {
  if (lancamentos.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        Nenhum lançamento ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full text-sm ${
          completa ? "min-w-[820px]" : "min-w-[600px]"
        }`}
      >
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="py-2.5 pr-3 font-medium">Data</th>
            <th className="py-2.5 pr-3 font-medium">Tipo</th>
            {completa && <th className="py-2.5 pr-3 font-medium">Categoria</th>}
            <th className="py-2.5 pr-3 font-medium">Cliente/Fornecedor</th>
            <th className="py-2.5 pr-3 font-medium">Forma pgto</th>
            <th className="py-2.5 pr-3 text-right font-medium">Valor</th>
            <th className="py-2.5 pr-3 font-medium">Nº Doc</th>
            {completa && <th className="py-2.5 font-medium">Descrição</th>}
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((l) => {
            const receita = l.tipo === "receita";
            return (
              <tr key={l.id} className="border-b border-gray-50 last:border-0">
                <td className="whitespace-nowrap py-2.5 pr-3 text-gray-700">
                  {formatData(l.data)}
                </td>
                <td
                  className={`py-2.5 pr-3 font-semibold ${
                    receita ? "text-semaforo-verde" : "text-semaforo-vermelho"
                  }`}
                >
                  {receita ? "Receita" : "Despesa"}
                </td>
                {completa && (
                  <td className="py-2.5 pr-3 text-gray-700">
                    {ou(l.categoriaNome)}
                  </td>
                )}
                <td className="py-2.5 pr-3 text-gray-700">{ou(l.nome_parte)}</td>
                <td className="py-2.5 pr-3 text-gray-700">
                  {ou(l.forma_pagamento)}
                </td>
                <td
                  className={`whitespace-nowrap py-2.5 pr-3 text-right font-semibold ${
                    receita ? "text-semaforo-verde" : "text-semaforo-vermelho"
                  }`}
                >
                  {formatBRL(l.valor)}
                </td>
                <td className="py-2.5 pr-3 text-gray-500">
                  {ou(l.numero_documento)}
                </td>
                {completa && (
                  <td className="py-2.5 text-gray-500">{ou(l.descricao)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
