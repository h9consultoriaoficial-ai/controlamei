"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [linkInvalido, setLinkInvalido] = useState<string | null>(null);

  // O link do e-mail traz o token (ou um erro) na URL. O createBrowserClient
  // detecta a sessão de recuperação automaticamente. Aqui só capturamos erros
  // explícitos (link expirado/usado) que o Supabase devolve no hash.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error")) {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const desc = params.get("error_description");
      setLinkInvalido(
        desc
          ? decodeURIComponent(desc.replace(/\+/g, " "))
          : "O link é inválido ou expirou. Peça um novo."
      );
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setErro("As senhas não são iguais.");
      return;
    }
    setErro(null);
    setSalvando(true);

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setSalvando(false);
      setErro(
        "Não foi possível atualizar a senha. O link pode ter expirado — peça um novo."
      );
      return;
    }

    // Encerra a sessão de recuperação e manda o usuário logar com a nova senha.
    await supabase.auth.signOut();
    router.push("/login?senhaAtualizada=1");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">
      <Link href="/" className="mb-8 self-start">
        <Logo className="h-8 w-auto" />
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900">Criar nova senha</h1>
      <p className="mt-1 text-gray-600">
        Defina a nova senha da sua conta do MEI no Limite.
      </p>

      {linkInvalido && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {linkInvalido}{" "}
          <Link href="/recuperar-senha" className="font-bold underline">
            Pedir novo link
          </Link>
        </div>
      )}

      {erro && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="label-field" htmlFor="senha">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="senha"
              type={verSenha ? "text" : "password"}
              className="input-field pr-16"
              placeholder="mínimo 6 caracteres"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

        <div>
          <label className="label-field" htmlFor="confirma">
            Confirmar nova senha
          </label>
          <input
            id="confirma"
            type={verSenha ? "text" : "password"}
            className="input-field"
            placeholder="repita a senha"
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary mt-2 w-full"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 block text-center text-sm font-semibold text-primary hover:underline"
      >
        Voltar ao login
      </Link>
    </main>
  );
}
