import Link from "next/link";
import Image from "next/image";
import FAQ from "@/components/FAQ";

// Marketing: número de vagas restantes (ajuste à vontade).
const VAGAS_RESTANTES = 37;

export default function LandingPage() {
  const hoje = new Date();
  const diasFimAno = Math.max(
    0,
    Math.ceil(
      (new Date(hoje.getFullYear(), 11, 31).getTime() - hoje.getTime()) /
        86_400_000
    )
  );

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
          Você pode já ter{" "}
          <span className="hl-red">estourado o limite do MEI</span> e nem saber.
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

      {/* ===================== VEJA O APP POR DENTRO ===================== */}
      <section className="px-5 py-16">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#FFC53D]">
            Veja o app por dentro
          </p>
          <h2 className="mt-2 text-center text-2xl font-extrabold sm:text-3xl">
            É isso que você abre no celular
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#A0A0B0]">
            Sem telas complicadas. Você olha a cor, vê quanto ainda pode vender e
            manda pro contador.
          </p>

          <div className="mt-10 flex flex-wrap items-start justify-center gap-7">
            {/* Tela 1 — Semáforo */}
            <div className="flex flex-col items-center">
              <div className="w-[230px] rounded-[34px] border-8 border-white/10 bg-[#0A0E0C] p-3 shadow-2xl">
                <div className="min-h-[400px] rounded-[22px] bg-[#F1F5F9] p-3.5 text-[#0B1120]">
                  <p className="pb-3 text-[13px] font-extrabold">MEI no Limite</p>
                  <div className="flex items-center gap-3 rounded-2xl bg-[#FEF3C7] p-3">
                    <div className="flex flex-col gap-1.5 rounded-xl bg-gray-900 p-1.5">
                      <span className="h-4 w-4 rounded-full bg-[#FF5C5C] opacity-20" />
                      <span className="h-4 w-4 rounded-full bg-[#FFC53D] shadow-[0_0_10px_#FFC53D]" />
                      <span className="h-4 w-4 rounded-full bg-[#39D98A] opacity-20" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase text-[#B45309]">
                        Atenção!
                      </p>
                      <p className="text-[30px] font-extrabold leading-none">78%</p>
                      <p className="text-[11px] text-[#64748B]">
                        do limite anual usado
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-center text-[12px] text-[#065F46]">
                    Você ainda pode vender
                    <span className="mt-1 block text-[22px] font-extrabold text-[#16A34A]">
                      R$ 17.820
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between border-b border-dashed border-gray-200 py-2 text-[12px]">
                    <span className="text-[#94A3B8]">Limite anual</span>
                    <span>R$ 81.000</span>
                  </div>
                  <div className="flex justify-between py-2 text-[12px]">
                    <span className="text-[#94A3B8]">Já faturado</span>
                    <span>R$ 63.180</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#A0A0B0]">
                🚦 Seu semáforo
              </p>
            </div>

            {/* Tela 2 — Lançar */}
            <div className="flex flex-col items-center">
              <div className="w-[230px] rounded-[34px] border-8 border-white/10 bg-[#0A0E0C] p-3 shadow-2xl">
                <div className="min-h-[400px] rounded-[22px] bg-[#F1F5F9] p-3.5 text-[#0B1120]">
                  <p className="pb-3 text-[13px] font-extrabold">Nova venda</p>
                  <p className="mb-2 text-[13px] font-extrabold">Lançar receita</p>
                  <div className="mb-2 flex justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px]">
                    <span className="text-[#94A3B8]">Valor</span>
                    <span className="font-bold">R$ 250,00</span>
                  </div>
                  <div className="mb-3 flex justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px]">
                    <span className="text-[#94A3B8]">Data</span>
                    <span>27/06/2026</span>
                  </div>
                  <p className="mb-1.5 text-[11px] text-[#94A3B8]">
                    Forma de pagamento
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#16A34A] px-2.5 py-1 text-[11px] font-semibold text-white">
                      PIX
                    </span>
                    <span className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-[#475569]">
                      Dinheiro
                    </span>
                    <span className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-[#475569]">
                      Cartão
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#16A34A] py-2.5 text-center text-[13px] font-extrabold text-white">
                    Salvar lançamento
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#A0A0B0]">
                ✍️ Lançar em 3 toques
              </p>
            </div>

            {/* Tela 3 — Relatório */}
            <div className="flex flex-col items-center">
              <div className="w-[230px] rounded-[34px] border-8 border-white/10 bg-[#0A0E0C] p-3 shadow-2xl">
                <div className="min-h-[400px] rounded-[22px] bg-[#F1F5F9] p-3.5 text-[#0B1120]">
                  <p className="pb-3 text-[13px] font-extrabold">Relatório</p>
                  <p className="mb-2 text-[13px] font-extrabold">
                    Resumo do ano · 2026
                  </p>
                  <div className="flex justify-between border-b border-dashed border-gray-200 py-2 text-[12px]">
                    <span>Receitas</span>
                    <span className="font-bold text-[#16A34A]">R$ 63.180</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 py-2 text-[12px]">
                    <span>Despesas</span>
                    <span className="font-bold text-[#DC2626]">R$ 11.430</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 py-2 text-[12px]">
                    <span>Saldo líquido</span>
                    <span className="font-bold">R$ 51.750</span>
                  </div>
                  <div className="flex justify-between py-2 text-[12px]">
                    <span>% do limite</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="mt-3 rounded-lg bg-[#25D366] py-2.5 text-center text-[13px] font-extrabold text-white">
                    Enviar pro contador
                  </div>
                  <p className="mt-2 text-center text-[11px] text-[#64748B]">
                    Link abre sem login
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#A0A0B0]">
                📄 Relatório num toque
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EQUAÇÃO DE VALOR ===================== */}
      <section className="px-5 py-16">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Por que funciona pra você
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#A0A0B0]">
            Mesmo se você &quot;não é boa de tecnologia&quot;.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { e: "🎯", t: "Resultado", d: "Dormir tranquila, nunca mais ser pega de surpresa." },
              { e: "✅", t: "Confiança", d: "À prova de leigo + regra automática + garantia de 30 dias." },
              { e: "⚡", t: "Rapidez", d: "Sua primeira cor em 2 minutos." },
              { e: "🪶", t: "Esforço", d: "3 toques. Sem instalar. Sem imposto pra entender." },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center"
              >
                <div className="text-3xl">{c.e}</div>
                <h3 className="mt-2 font-extrabold text-[#F4F4F6]">{c.t}</h3>
                <p className="mt-1 text-sm text-[#A0A0B0]">{c.d}</p>
              </div>
            ))}
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

      {/* ===================== BÔNUS ===================== */}
      <section className="bg-[#0E1310] px-5 py-16">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            E ainda leva 7 bônus
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#A0A0B0]">
            Tudo dentro dos R$ 27,90/mês.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {[
              { n: "Raio-X do Seu Ano — projeção de onde você fecha dezembro", v: "R$ 297" },
              { n: "Pasta do Contador Pronta — relatório num toque", v: "R$ 397" },
              { n: "Lembrete que não deixa esquecer — alerta diário no WhatsApp", v: "R$ 247" },
              { n: "Destravada em 3 Minutos — mini-treino sem imposto", v: "R$ 197" },
              { n: "Guia dos 3 Meses que mais derrubam MEI", v: "R$ 197" },
              { n: "Veja Antes de Confiar — demo + seu número antes de pagar", v: "R$ 297" },
              { n: "Acesso Fundador Vitalício — preço travado pra sempre", v: "R$ 215" },
            ].map((b) => (
              <li
                key={b.n}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-lg">🎁</span>
                  <span className="text-[#F4F4F6]">{b.n}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-[#A0A0B0] line-through">
                  {b.v}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-lg font-extrabold text-[#F4F4F6]">
            Valor total dos bônus:{" "}
            <span className="text-[#39D98A]">R$ 1.847</span>
          </p>
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
            <span>Só em bônus:</span>
            <span className="text-xl font-bold line-through">R$ 1.847</span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3 text-[#A0A0B0]">
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

      {/* ===================== ESCASSEZ + URGÊNCIA ===================== */}
      <section className="bg-[#0E1310] px-5 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Por que decidir agora
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#A0A0B0]">
            As duas razões são reais.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#FFC53D]/30 bg-[#FFC53D]/[0.06] p-5">
              <h3 className="font-extrabold text-[#FFC53D]">🔒 Vagas</h3>
              <p className="mt-2 text-[#F4F4F6]">
                Os 300 primeiros travam <strong>R$ 27,90 pra sempre</strong>.
                Quando o preço voltar pra R$ 87,90, você continua no de Fundador.
                Restam {VAGAS_RESTANTES} de 300.
              </p>
            </div>
            <div className="rounded-2xl border border-[#FFC53D]/30 bg-[#FFC53D]/[0.06] p-5">
              <h3 className="font-extrabold text-[#FFC53D]">⏳ Tempo</h3>
              <p className="mt-2 text-[#F4F4F6]">
                Faltam <strong>{diasFimAno} dias</strong> pro fim do ano fiscal — e
                o estrago do limite é <strong>retroativo a janeiro</strong>.
                Descobrir em dezembro é tarde demais.
              </p>
            </div>
          </div>
          <p className="mt-6 text-center font-extrabold text-[#F4F4F6]">
            O preço só fica barato pros 300 primeiros, e o risco só cresce a cada
            mês. Esperar perde nos dois.
          </p>
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
