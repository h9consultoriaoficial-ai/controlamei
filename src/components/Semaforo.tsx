import type { StatusSemaforo } from "@/lib/mei";
import { formatPct } from "@/lib/format";

const config: Record<
  StatusSemaforo,
  { cor: string; bg: string; texto: string; titulo: string }
> = {
  verde: {
    cor: "bg-semaforo-verde",
    bg: "bg-green-50",
    texto: "text-green-700",
    titulo: "Tudo certo!",
  },
  amarelo: {
    cor: "bg-semaforo-amarelo",
    bg: "bg-amber-50",
    texto: "text-amber-700",
    titulo: "Atenção!",
  },
  vermelho: {
    cor: "bg-semaforo-vermelho",
    bg: "bg-red-50",
    texto: "text-red-700",
    titulo: "Limite estourado!",
  },
};

export default function Semaforo({
  status,
  pctUsado,
}: {
  status: StatusSemaforo;
  pctUsado: number;
}) {
  const c = config[status];
  const ordem: StatusSemaforo[] = ["vermelho", "amarelo", "verde"];

  return (
    <div className={`card flex items-center gap-5 ${c.bg}`}>
      {/* Luzes do semáforo */}
      <div className="flex flex-col gap-2 rounded-2xl bg-gray-900 p-3">
        {ordem.map((s) => (
          <span
            key={s}
            className={`h-7 w-7 rounded-full transition-opacity ${
              s === "vermelho"
                ? "bg-semaforo-vermelho"
                : s === "amarelo"
                ? "bg-semaforo-amarelo"
                : "bg-semaforo-verde"
            } ${status === s ? "opacity-100 shadow-lg" : "opacity-20"}`}
            aria-hidden
          />
        ))}
      </div>

      {/* Texto */}
      <div className="flex-1">
        <p className={`text-sm font-bold uppercase tracking-wide ${c.texto}`}>
          {c.titulo}
        </p>
        <p className="mt-0.5 text-4xl font-extrabold text-gray-900">
          {formatPct(pctUsado)}
        </p>
        <p className="text-sm text-gray-500">do limite anual usado</p>
      </div>
    </div>
  );
}
