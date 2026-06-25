"use client";

import { useState, useTransition } from "react";
import { gerarRelatorio } from "@/app/app/relatorio/actions";

export default function EnviarContador({
  temContador,
}: {
  temContador: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  function handleEnviar() {
    setErro(null);
    setCopiado(false);
    startTransition(async () => {
      const res = await gerarRelatorio();
      if (!res.ok) {
        setErro(res.error || "Erro ao gerar o relatório.");
        return;
      }
      setLink(res.publicUrl || null);
      if (res.waUrl) {
        // Abre o WhatsApp com a mensagem pronta.
        window.open(res.waUrl, "_blank");
      }
    });
  }

  async function copiarLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleEnviar}
        disabled={pending}
        className="btn-primary w-full text-lg"
      >
        {pending ? "Gerando..." : "📤 Enviar pro contador"}
      </button>

      {!temContador && (
        <p className="text-center text-sm text-amber-600">
          Você não cadastrou o WhatsApp do contador. Geramos o link para você
          copiar e enviar.
        </p>
      )}

      {erro && (
        <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}

      {link && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">
            Link do relatório:
          </p>
          <p className="mt-1 break-all text-sm text-gray-800">{link}</p>
          <button
            type="button"
            onClick={copiarLink}
            className="mt-2 text-sm font-semibold text-primary hover:underline"
          >
            {copiado ? "✓ Copiado!" : "Copiar link"}
          </button>
        </div>
      )}
    </div>
  );
}
