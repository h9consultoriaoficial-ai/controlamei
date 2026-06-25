"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  TIPOS_ATIVIDADE,
  TIPOS_MEI,
  getLimite,
  labelTipoMei,
} from "@/lib/constants";
import { formatBRL, formatCPF, maskPhone } from "@/lib/format";
import { atualizarPerfil } from "@/app/actions/perfil";

interface TenantForm {
  nome: string;
  cpf: string;
  whatsapp: string;
  tipo_mei: string;
  tipo_atividade: string;
  nome_contador: string;
  whatsapp_contador: string;
}

export default function PerfilForm({
  email,
  tenant,
}: {
  email: string;
  tenant: TenantForm;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const tipoMeiOriginal = tenant.tipo_mei;

  const [nome, setNome] = useState(tenant.nome);
  const [whatsapp, setWhatsapp] = useState(maskPhone(tenant.whatsapp));
  const [tipoMei, setTipoMei] = useState(tenant.tipo_mei);
  const [tipoAtividade, setTipoAtividade] = useState(tenant.tipo_atividade);
  const [nomeContador, setNomeContador] = useState(tenant.nome_contador);
  const [whatsappContador, setWhatsappContador] = useState(
    maskPhone(tenant.whatsapp_contador)
  );

  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);

  function salvar() {
    setMsg(null);
    startTransition(async () => {
      const res = await atualizarPerfil({
        nome,
        whatsapp,
        tipo_mei: tipoMei,
        tipo_atividade: tipoAtividade,
        nome_contador: nomeContador,
        whatsapp_contador: whatsappContador,
      });
      setModalAberto(false);
      if (res.sucesso) {
        setMsg({ tipo: "ok", texto: "Perfil atualizado com sucesso." });
        router.refresh();
      } else {
        setMsg({ tipo: "erro", texto: res.erro || "Erro ao salvar." });
      }
    });
  }

  function handleSalvarClick() {
    if (!nome.trim()) {
      setMsg({ tipo: "erro", texto: "Digite seu nome." });
      return;
    }
    // Mudou o tipo de MEI? Confirma antes (muda o limite).
    if (tipoMei !== tipoMeiOriginal) {
      setModalAberto(true);
      return;
    }
    salvar();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="card flex flex-col gap-4">
        <Campo label="Nome completo" value={nome} onChange={setNome} />

        {/* Não editáveis */}
        <CampoDesabilitado label="E-mail" value={email} />
        <CampoDesabilitado label="CPF" value={formatCPF(tenant.cpf)} />

        <CampoTel label="Seu WhatsApp" value={whatsapp} onChange={setWhatsapp} />

        <div>
          <label className="label-field" htmlFor="tipo_mei">
            Tipo de MEI
          </label>
          <select
            id="tipo_mei"
            value={tipoMei}
            onChange={(e) => setTipoMei(e.target.value)}
            className="input-field"
          >
            {TIPOS_MEI.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} — limite {formatBRL(t.limite)}/ano
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-field" htmlFor="tipo_atividade">
            Tipo de atividade
          </label>
          <select
            id="tipo_atividade"
            value={tipoAtividade}
            onChange={(e) => setTipoAtividade(e.target.value)}
            className="input-field"
          >
            {TIPOS_ATIVIDADE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700">Seu contador</p>
        <Campo
          label="Nome do contador"
          value={nomeContador}
          onChange={setNomeContador}
        />
        <CampoTel
          label="WhatsApp do contador"
          value={whatsappContador}
          onChange={setWhatsappContador}
        />
      </div>

      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
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
        onClick={handleSalvarClick}
        disabled={pending}
        className="btn-primary w-full text-lg"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>

      {/* Modal de confirmação da mudança de tipo de MEI */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => !pending && setModalAberto(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">
              Confirmar mudança de tipo
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Você está alterando seu tipo de MEI de{" "}
              <strong>{labelTipoMei(tipoMeiOriginal)}</strong> para{" "}
              <strong>{labelTipoMei(tipoMei)}</strong>. Seu limite mudará de{" "}
              <strong>{formatBRL(getLimite(tipoMeiOriginal))}</strong> para{" "}
              <strong>{formatBRL(getLimite(tipoMei))}</strong>. Seus lançamentos
              não serão alterados. Deseja confirmar?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={pending}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvar}
                disabled={pending}
                className="btn-primary flex-1"
              >
                {pending ? "Salvando..." : "Confirmar alteração"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function CampoTel({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input
        className="input-field"
        type="tel"
        inputMode="numeric"
        placeholder="(19) 99955-1747"
        value={value}
        onChange={(e) => onChange(maskPhone(e.target.value))}
      />
    </div>
  );
}

function CampoDesabilitado({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input
        className="input-field cursor-not-allowed bg-gray-100 text-gray-500"
        value={value}
        disabled
        readOnly
      />
      <p className="mt-1 text-xs text-gray-400">Não editável</p>
    </div>
  );
}
