"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const limpo = email.trim().toLowerCase();
    if (!limpo || !limpo.includes("@")) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setErro(null);
    setEnviando(true);

    const { error } = await supabase.auth.resetPasswordForEmail(limpo, {
      redirectTo: `${window.location.origin}/nova-senha`,
    });

    setEnviando(false);

    if (error && error.message.toLowerCase().includes("rate")) {
      setErro("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
      return;
    }

    // Sucesso mostrado mesmo se o e-mail não existir (evita enumeração).
    setEnviado(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">
      <Link href="/" className="mb-8 self-start">
        <Logo className="h-8 w-auto" />
      </Link>

      {enviado ? (
        <div>
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-6 text-center">
            <div className="text-4xl">📧</div>
            <h1 className="mt-3 text-xl font-extrabold text-gray-900">
              Verifique seu e-mail
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Se houver uma conta com <strong>{email.trim()}</strong>, enviamos
              um link para você criar uma nova senha. Pode levar alguns minutos
              — confira também o spam.
            </p>
          </div>
          <Link
            href="/login"
            className="btn-outline mt-6 w-full"
          >
            Voltar ao login
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Esqueci minha senha
          </h1>
          <p className="mt-1 text-gray-600">
            Digite seu e-mail que enviamos um link para você criar uma nova
            senha.
          </p>

          {erro && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary mt-2 w-full"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 block text-center text-sm font-semibold text-primary hover:underline"
          >
            Voltar ao login
          </Link>
        </div>
      )}
    </main>
  );
}
