import { formatBRL, formatPct } from "@/lib/format";
import type { CategoriaGasto } from "@/lib/mei";

/**
 * Ranking de categorias de despesa: nome | total gasto | % do total de
 * despesas, ordenado do maior para o menor (já vem ordenado de
 * rankingCategorias). Reusado em histórico, relatório e rota pública.
 */
export default function RankingCategorias({
  ranking,
}: {
  ranking: CategoriaGasto[];
}) {
  if (ranking.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        Nenhuma despesa lançada ainda.
      </p>
    );
  }

  const maior = ranking[0].total || 1;

  return (
    <ul className="flex flex-col gap-3">
      {ranking.map((c) => (
        <li key={c.nome}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{c.nome}</span>
            <span className="font-semibold text-gray-900">
              {formatBRL(c.total)}{" "}
              <span className="text-xs font-normal text-gray-400">
                ({formatPct(c.pct)})
              </span>
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-semaforo-vermelho"
              style={{ width: `${Math.max((c.total / maior) * 100, 4)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
