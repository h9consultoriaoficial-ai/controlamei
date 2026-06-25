"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { login, type LoginState } from "./actions";

const estadoInicial: LoginState = {};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [state, formAction] = useFormState(login, estadoInicial);
  const [verSenha, setVerSenha] = useState(false);
  const params = useSearchParams();
  const senhaAtualizada = params.get("senhaAtualizada") === "1";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">
      <Link href="/" className="mb-8 self-start">
        <Logo size="md" />
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900">Entrar</h1>
      <p className="mt-1 text-gray-600">Acesse sua conta do MEI no Limite.</p>

      {senhaAtualizada && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ Senha atualizada com sucesso. Entre com a nova senha.
        </div>
      )}

      {state.error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="label-field" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field"
            placeholder="voce@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="label-field" htmlFor="senha">
            Senha
          </label>
          <div className="relative">
            <input
              id="senha"
              name="senha"
              type={verSenha ? "text" : "password"}
              className="input-field pr-16"
              placeholder="sua senha"
              autoComplete="current-password"
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

        <BotaoEntrar />
      </form>

      <Link
        href="/recuperar-senha"
        className="mt-4 text-center text-sm font-semibold text-primary hover:underline"
      >
        Esqueci minha senha
      </Link>

      <p className="mt-6 text-center text-sm text-gray-600">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-primary hover:underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </main>
  );
}

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary mt-2 w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}
