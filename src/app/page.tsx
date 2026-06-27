import Link from "next/link";
import Image from "next/image";
import FAQ from "@/components/FAQ";

// Marketing: número de vagas restantes (ajuste à vontade).
const VAGAS_RESTANTES = 37;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E0C] text-[#F4F4F6]">
      {/* ===================== HERO ===================== */}
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 pb-16 pt-10 text-center">
        <Image
          src="/logo/horizontal-dark.svg"
          alt="MEI no Limite"
          width={1024}
          height={463}
          priority
          unoptimized
          className="h-10 w-auto"
        />

        <span className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#FF5C5C]/30 bg-[#FF5C5C]/10 px-4 py-1.5 text-sm font-semibold text-[#FF5C5C]">
          🔴 {VAGAS_RESTANTES} de 300 vagas de Fundador restantes
        </span>

        <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Você pode já ter estourado o limite do MEI e nem saber.
        </h1>

        <p className="mt-5 max-w-xl text-lg text-[#A0A0B0]">
          O MEI no Limite avisa quando você está perto do limite de R$ 81.000 —
          antes de ser tarde demais.
        </p>

        <div className="mt-8 flex items-baseline justify-center gap-3">
          <span className="text-lg text-[#A0A0B0] line-through">
            R$ 87,90/mês
          </span>
          <span className="text-4xl font-extrabold text-[#39D98A]">
            R$ 27,90<span className="text-xl font-bold">/mês</span>
          </span>
        </div>
        <p className="mt-2 text-sm text-[#A0A0B0]">
          Plano anual R$ 334,80 · R$ 0,93/dia · menos que um café
        </p>

        <Link href="/cadastro" className="btn-lp mt-8 w-full sm:w-auto">
          Quero saber meu número agora →
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-[#A0A0B0]">
          <span>✓ Garantia 30 dias</span>
          <span>✓ Sem fidelidade</span>
          <span>✓ PWA sem instalar</span>
        </div>
      </section>

      {/* ===================== DOR ===================== */}
      <section className="bg-[#0E1310] px-5 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Isso já aconteceu com você?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              "Não sei quanto já vendi esse ano",
              "Tenho medo de estourar o limite sem perceber",
              "Só descubro o problema quando o contador liga",
            ].map((txt) => (
              <div
                key={txt}
                className="rounded-2xl border border-[#FF5C5C]/20 bg-[#FF5C5C]/[0.06] p-5"
              >
                <span className="text-2xl">😰</span>
                <p className="mt-2 font-semibold text-[#F4F4F6]">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SEMÁFORO ===================== */}
      <section className="px-5 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Simples assim — igual um semáforo
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Passo
              cor="#39D98A"
              emoji="🟢"
              titulo="Verde"
              texto="Pode vender à vontade."
            />
            <Passo
              cor="#FFC53D"
              emoji="🟡"
              titulo="Amarelo"
              texto="Atenção, está chegando perto."
            />
            <Passo
              cor="#FF5C5C"
              emoji="🔴"
              titulo="Vermelho"
              texto="Pare e fale com seu contador."
            />
          </div>
        </div>
      </section>

      {/* ===================== O QUE ESTÁ INCLUSO ===================== */}
      <section className="bg-[#0E1310] px-5 py-16">
        <div className="mx-auto w-full max-w-xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Tudo que você leva hoje
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {[
              "Semáforo do limite em tempo real",
              "Lançamento de receitas e despesas",
              "Categorias de despesa (aluguel, estoque, frete...)",
              "Relatório mês a mês para o contador",
              "Envio pro contador via WhatsApp em 1 toque",
              "Funciona no celular sem instalar (PWA)",
              "MEI Padrão (R$ 81.000) e Caminhoneiro (R$ 251.600)",
              "Histórico com gráfico anual",
              "Dados seguros e isolados",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-lg font-bold text-[#39D98A]">
                  ✓
                </span>
                <span className="text-[#F4F4F6]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== ANCORAGEM DE PREÇO ===================== */}
      <section className="px-5 py-16">
        <div className="mx-auto w-full max-w-xl text-center">
          <div className="rounded-2xl border border-[#FF5C5C]/20 bg-[#FF5C5C]/[0.06] p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FF5C5C]">
              O problema custa
            </p>
            <p className="mt-1 text-3xl font-extrabold text-[#FF5C5C]">
              R$ 15.000
            </p>
            <p className="mt-1 text-sm text-[#A0A0B0]">
              em impostos retroativos se você estourar o limite sem perceber.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-[#A0A0B0]">
            <span>Preço cheio:</span>
            <span className="text-xl font-bold line-through">R$ 87,90/mês</span>
          </div>

          <div className="mt-4 rounded-2xl border-2 border-[#39D98A] bg-[#39D98A]/[0.08] p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#39D98A]">
              Preço de Fundador
            </p>
            <p className="mt-1 text-5xl font-extrabold text-[#39D98A]">
              R$ 27,90
              <span className="text-2xl font-bold">/mês</span>
            </p>
            <p className="mt-2 text-[#F4F4F6]">
              = R$ 0,93/dia · menos que um café
            </p>
          </div>

          <Link href="/cadastro" className="btn-lp mt-6 w-full">
            Garantir meu acesso de Fundador
          </Link>
          <p className="mt-3 text-sm text-[#A0A0B0]">
            Plano anual · R$ 334,80 à vista · Trava de preço vitalícia para os
            300 primeiros
          </p>
        </div>
      </section>

      {/* ===================== OBJEÇÕES (FAQ) ===================== */}
      <section className="bg-[#0E1310] px-5 py-16">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold sm:text-3xl">
            Perguntas frequentes
          </h2>
          <FAQ />
        </div>
      </section>

      {/* ===================== GARANTIA ===================== */}
      <section className="px-5 py-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border-2 border-[#39D98A] bg-[#39D98A]/[0.08] p-7 text-center">
            <span className="text-4xl">🛡️</span>
            <h2 className="mt-3 text-xl font-extrabold text-[#39D98A]">
              Garantia incondicional de 30 dias
            </h2>
            <p className="mt-2 text-[#F4F4F6]">
              Testou e não gostou? Devolvemos cada centavo. Sem perguntas, sem
              burocracia. O risco é todo nosso.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto w-full max-w-xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Seu MEI merece controle.
          </h2>
          <p className="mt-3 text-lg text-[#A0A0B0]">
            Entre para o grupo dos 300 Fundadores.
          </p>
          <Link href="/cadastro" className="btn-lp mt-8 w-full sm:w-auto">
            Criar minha conta grátis →
          </Link>
          <p className="mt-4 text-sm text-[#A0A0B0]">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-[#39D98A] hover:underline">
              Entrar →
            </Link>
          </p>
        </div>
      </section>

      {/* ===================== RODAPÉ ===================== */}
      <footer className="border-t border-white/10 px-5 py-10 text-center">
        <Image
          src="/logo/horizontal-dark.svg"
          alt="MEI no Limite"
          width={1024}
          height={463}
          unoptimized
          className="mx-auto h-8 w-auto"
        />
        <p className="mt-4 text-sm text-[#A0A0B0]">
          MEI no Limite · by H9 Consultoria
        </p>
        <p className="text-sm text-[#A0A0B0]">meinolimite.com.br</p>
        <p className="mt-2 text-xs text-[#A0A0B0]/70">
          © 2026 · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}

function Passo({
  cor,
  emoji,
  titulo,
  texto,
}: {
  cor: string;
  emoji: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="mt-2 text-lg font-extrabold" style={{ color: cor }}>
        {titulo}
      </h3>
      <p className="mt-1 text-sm text-[#A0A0B0]">{texto}</p>
    </div>
  );
}
