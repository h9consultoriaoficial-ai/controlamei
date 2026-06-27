"use client";

import { useState } from "react";

const ITENS: { p: string; r: string }[] = [
  {
    p: "É difícil de usar?",
    r: "Se você usa WhatsApp, você usa o MEI no Limite. São 3 toques. Sem planilha, sem imposto, sem complicação.",
  },
  {
    p: "Precisa instalar alguma coisa?",
    r: "Não. Abre direto no celular pelo navegador. Pode adicionar na tela inicial como um app normal.",
  },
  {
    p: "E se eu esquecer de usar?",
    r: "O app guarda seus lançamentos. Você não perde nada. Lança quando lembrar — o semáforo sempre mostra o total.",
  },
  {
    p: "E se eu quiser cancelar?",
    r: "Cancela quando quiser. Sem multa, sem ligação, sem burocracia.",
  },
  {
    p: "Meu contador já cuida disso.",
    r: "O MEI no Limite não substitui seu contador — alimenta ele com o relatório pronto. Você manda em 1 toque pelo WhatsApp, ele já recebe tudo organizado.",
  },
  {
    p: "Vale pra MEI Caminhoneiro?",
    r: "Sim. O app suporta MEI Caminhoneiro com limite de R$ 251.600. O semáforo se ajusta automaticamente.",
  },
];

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {ITENS.map((item, i) => {
        const open = aberto === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <button
              type="button"
              onClick={() => setAberto(open ? null : i)}
              aria-expanded={open}
              className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-[#F4F4F6]">{item.p}</span>
              <span
                className={`shrink-0 text-2xl leading-none text-[#39D98A] transition-transform ${
                  open ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open && (
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-[#A0A0B0]">
                {item.r}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
