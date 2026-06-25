"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Logo from "@/components/Logo";
import { TIPOS_ATIVIDADE } from "@/lib/constants";
import { cadastrar, type CadastroState } from "./actions";

const estadoInicial: CadastroState = {};

export default function CadastroPage() {
  const [state, formAction] = useFormState(cadastrar, estadoInicial);
  const [verSenha, setVerSenha] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <Link href="/" className="mb-8">
        <Logo size="md" />
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900">Criar conta</h1>
      <p className="mt-1 text-gray-600">
        Leva 1 minuto. Depois é só lançar suas vendas.
      </p>

      {state.error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <Campo label="Seu nome" name="nome" placeholder="Maria da Silva" required />

        <Campo
          label="E-mail (para entrar)"
          name="email"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          required
        />

        <Campo
          label="CPF"
          name="cpf"
          placeholder="000.000.000-00"
          inputMode="numeric"
          required
        />

        <Campo
          label="Seu WhatsApp"
          name="whatsapp"
          placeholder="(11) 99999-9999"
          inputMode="tel"
        />

        <div>
          <label className="label-field" htmlFor="tipo_atividade">
            Tipo de atividade
          </label>
          <select
            id="tipo_atividade"
            name="tipo_atividade"
            className="input-field"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Escolha...
            </option>
            {TIPOS_ATIVIDADE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <hr className="my-1 border-gray-100" />
        <p className="text-sm font-semibold text-gray-700">Seu contador</p>

        <Campo
          label="Nome do contador"
          name="nome_contador"
          placeholder="Nome do escritório ou pessoa"
        />

        <Campo
          label="WhatsApp do contador"
          name="whatsapp_contador"
          placeholder="(11) 99999-9999"
          inputMode="tel"
        />

        <hr className="my-1 border-gray-100" />

        <div>
          <label className="label-field" htmlFor="senha">
            Crie uma senha
          </label>
          <div className="relative">
            <input
              id="senha"
              name="senha"
              type={verSenha ? "text" : "password"}
              className="input-field pr-16"
              placeholder="mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setVerSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary"
            >
              {verSenha ? "ocultar" : "mostrar"}
            </button>
          </div>
        </div>

        <BotaoEnviar />
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}

function Campo({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label-field" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} className="input-field" {...props} />
    </div>
  );
}

function BotaoEnviar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary mt-2 w-full" disabled={pending}>
      {pending ? "Criando conta..." : "Criar minha conta"}
    </button>
  );
}
