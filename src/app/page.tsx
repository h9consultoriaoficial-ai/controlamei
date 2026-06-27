import Link from "next/link";
import Logo from "@/components/Logo";
import { MEI_LIMITE } from "@/lib/constants";
import { formatBRL } from "@/lib/format";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Topo */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Logo className="h-8 w-auto" />
        <Link
          href="/login"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-12 text-center">
        <span className="mb-4 rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
          Feito pra quem é MEI
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Seu faturamento sempre{" "}
          <span className="text-primary">no limite certo</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-gray-600">
          Lance suas vendas todo mês, veja num semáforo se está perto do limite
          de {formatBRL(MEI_LIMITE)} e mande o relatório pro seu contador pelo
          WhatsApp. Simples assim.
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/cadastro" className="btn-primary w-full sm:w-auto">
            Criar minha conta grátis
          </Link>
          <Link href="/login" className="btn-outline w-full sm:w-auto">
            Já tenho conta
          </Link>
        </div>

        {/* Benefícios */}
        <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <Beneficio
            emoji="🚦"
            titulo="Semáforo do limite"
            texto="Verde, amarelo ou vermelho: saiba na hora se pode vender mais."
          />
          <Beneficio
            emoji="📊"
            titulo="Histórico do ano"
            texto="Veja mês a mês quanto faturou e acompanhe a média."
          />
          <Beneficio
            emoji="📱"
            titulo="Relatório no WhatsApp"
            texto="Um toque e o resumo vai direto pro seu contador."
          />
        </div>
      </section>

      <footer className="mx-auto w-full max-w-5xl px-5 py-8 text-center text-sm text-gray-400">
        MEI no Limite — meinolimite.com.br
      </footer>
    </main>
  );
}

function Beneficio({
  emoji,
  titulo,
  texto,
}: {
  emoji: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="card text-left">
      <div className="mb-2 text-3xl">{emoji}</div>
      <h3 className="font-bold text-gray-900">{titulo}</h3>
      <p className="mt-1 text-sm text-gray-600">{texto}</p>
    </div>
  );
}
