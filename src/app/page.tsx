import Link from "next/link";
import Image from "next/image";
import { buscarVagasRestantes } from "@/app/actions/configuracoes";

// Checkout da Cakto (env com a URL real como fallback).
const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL ||
  "https://pay.cakto.com.br/bap6dvn_945227";

// ISR: revalida a cada 60s para refletir vagas (banco) e dias do ano fiscal.
export const revalidate = 60;

export default async function LandingPage() {
  const { total: vagasTotal, restantes: vagasRestantes } =
    await buscarVagasRestantes();

  const hoje = new Date();
  const diasFimAno = Math.max(
    0,
    Math.ceil(
      (new Date(hoje.getFullYear(), 11, 31).getTime() - hoje.getTime()) /
        86_400_000
    )
  );

  return (
    <div className="lp">
      {/* ===================== HERO ===================== */}
      <section className="lp-hero lp-sec">
        <div className="lp-wrap">
          <Image
            src="/logo/horizontal-dark.svg"
            alt="MEI no Limite"
            width={1024}
            height={463}
            priority
            unoptimized
            className="h-9 w-auto"
          />
          <div className="lp-hero-grid" style={{ marginTop: 26 }}>
            <div>
              <span className="lp-pill">
                <span className="lp-dotpulse" /> Acesso Fundador · restam{" "}
                {vagasRestantes} de {vagasTotal} vagas
              </span>
              <h1>
                Você pode já ter{" "}
                <span className="hl-red">estourado o limite do MEI</span> e nem
                saber.
              </h1>
              <p className="lp-sub">
                Descubra em 2 minutos, no seu celular, quanto ainda pode vender
                este ano — antes do contador ligar com uma multa de R$ 15.000.
              </p>
              <ul>
                <li>
                  <span className="lp-check">✓</span>{" "}
                  <b>Saiba o seu número em 2 minutos:</b> veja, em reais, quanto
                  ainda pode vender sem virar empresa. Sem somar de cabeça, sem
                  planilha.
                </li>
                <li>
                  <span className="lp-check">✓</span>{" "}
                  <b>Seja avisada ANTES, não depois:</b> o amarelo acende
                  enquanto ainda dá pra frear.
                </li>
                <li>
                  <span className="lp-check">✓</span>{" "}
                  <b>Zero imposto pra entender:</b> você só olha a cor. O sistema
                  sabe o seu limite (R$ 81.000) e aplica a regra sozinho.
                </li>
              </ul>
              <a
                href={CHECKOUT_URL}
                className="lp-btn lp-btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero saber meu número agora
              </a>
              <p className="lp-micro">
                R$ 0,93 por dia. Menos que um café. Garantia de 30 dias.
              </p>
            </div>
            <div>
              <div className="lp-mock" aria-hidden="true">
                <div className="lp-farol">
                  <span className="lp-luz lp-vermelho" />
                  <span className="lp-luz lp-amarelo on" />
                  <span className="lp-luz lp-verde" />
                </div>
                <div className="lp-saldo">
                  <div className="lbl">Você ainda pode vender</div>
                  <div className="val">R$ 23.400</div>
                  <div className="lp-barra">
                    <i />
                  </div>
                  <div className="lbl" style={{ marginTop: 8 }}>
                    64% do limite de R$ 81.000 usado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DOR ===================== */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow">A verdade que ninguém te conta</div>
          <h2 className="lp-title">
            Sinceramente: você sabe quanto já faturou esse ano?
          </h2>
          <p className="lp-lead">
            Quase nenhum MEI sabe. As vendas são pequenas, pulverizadas, e
            ninguém soma. Aí vira o ano, o contador liga, e vem a frase que
            ninguém quer ouvir: &quot;você passou do limite.&quot; Quando você
            descobre, já é tarde — o estrago é retroativo a janeiro.
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              marginTop: 22,
              maxWidth: 680,
            }}
          >
            O problema não é faturar muito. É não contar. E quase ninguém conta.
          </p>
        </div>
      </section>

      {/* ===================== CUSTO ===================== */}
      <section className="lp-custo lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow" style={{ color: "#DC2626" }}>
            O custo de descobrir tarde demais
          </div>
          <h2 className="lp-title">
            Ultrapassar em mais de 20% te desenquadra retroativo a janeiro
          </h2>
          <p className="lp-lead">
            Você passa a ser cobrada como empresa o ano inteiro:
          </p>
          <ul>
            <li>
              Imposto recalculado como ME (retroativo) <b>+++</b>
            </li>
            <li>
              DAS e tributos retroativos <b>++</b>
            </li>
            <li>
              Multas e juros <b>++</b>
            </li>
            <li>
              Custo contábil de empresa <b>+</b>
            </li>
          </ul>
          <div className="lp-bignum">+ R$ 15.000</div>
          <p className="lp-lead">
            De uma vez. Sem aviso. O MEI no Limite custa{" "}
            <b style={{ color: "#fff" }}>R$ 334,80 no ano inteiro</b> — 2% do
            tamanho do buraco que ele tampa.
          </p>
        </div>
      </section>

      {/* ===================== MECANISMO ===================== */}
      <section className="lp-sec lp-center">
        <div className="lp-wrap">
          <div className="lp-eyebrow">A virada</div>
          <h2 className="lp-title">
            Conheça o Semáforo do MEI{" "}
            <span className="lp-semaforo">
              <span className="lp-s-g" />
              <span className="lp-s-a" />
              <span className="lp-s-r" />
            </span>
          </h2>
          <p className="lp-lead">
            Você não precisa aprender contabilidade. Você precisa de uma cor. O
            MEI no Limite transforma todas as suas vendas num semáforo que
            qualquer um entende:
          </p>
          <div className="lp-cards lp-c3">
            <div className="lp-card lp-farolcard g">
              <h3>🟢 Verde</h3>
              <p>Pode vender à vontade.</p>
            </div>
            <div className="lp-card lp-farolcard a">
              <h3>🟡 Amarelo</h3>
              <p>
                Atenção, está chegando perto.{" "}
                <b style={{ color: "#F59E0B" }}>
                  É aqui que está o pulo do gato: você é avisada ANTES.
                </b>
              </p>
            </div>
            <div className="lp-card lp-farolcard r">
              <h3>🔴 Vermelho</h3>
              <p>Pare, você está no limite.</p>
            </div>
          </div>
          <p className="lp-lead" style={{ marginTop: 26 }}>
            O amarelo é o que planilha, caderno e contador nunca te deram: um
            aviso antecipado, enquanto ainda dá tempo de agir.
          </p>
        </div>
      </section>

      {/* ===================== COMO FUNCIONA ===================== */}
      <section className="lp-alt lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Como funciona</div>
          <h2 className="lp-title">
            Simples assim. Feito pra quem não entende de imposto nem de app.
          </h2>
          <div style={{ marginTop: 28 }}>
            <div className="lp-passo">
              <div className="n">1</div>
              <div>
                <h3>Lance em 3 toques</h3>
                <p style={{ color: "#475569" }}>
                  Registre suas vendas no celular — ou responda 1 pergunta e veja
                  sua cor na hora, sem lançar nada.
                </p>
              </div>
            </div>
            <div className="lp-passo">
              <div className="n">2</div>
              <div>
                <h3>Veja seu saldo do ano</h3>
                <p style={{ color: "#475569" }}>
                  &quot;Você ainda pode vender R$ X este ano.&quot;
                </p>
              </div>
            </div>
            <div className="lp-passo">
              <div className="n">3</div>
              <div>
                <h3>Receba o alerta amarelo</h3>
                <p style={{ color: "#475569" }}>
                  Seja avisada antes de chegar no limite e mande o relatório pro
                  contador com um toque.
                </p>
              </div>
            </div>
          </div>
          <p className="lp-lead" style={{ marginTop: 10 }}>
            <b>
              Tudo no navegador do celular. Sem instalar nada. Se você usa
              WhatsApp, você usa isso.
            </b>
          </p>
        </div>
      </section>

      {/* ===================== VEJA O APP POR DENTRO ===================== */}
      <section className="lp-dark2 lp-sec lp-center">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Veja o app por dentro</div>
          <h2 className="lp-title">É isso que você abre no celular</h2>
          <p className="lp-lead">
            Sem telas complicadas. Você olha a cor, vê quanto ainda pode vender e
            manda pro contador.
          </p>
          <div className="lp-phones">
            {/* Tela 1 — Semáforo */}
            <div>
              <div className="lp-phone">
                <div className="lp-screen">
                  <p className="lp-appbar">MEI no Limite</p>
                  <div className="lp-sfcard">
                    <div className="lp-sflights">
                      <span className="r" />
                      <span className="a on" />
                      <span className="g" />
                    </div>
                    <div>
                      <p className="lp-sftt">Atenção!</p>
                      <p className="lp-sfpct">78%</p>
                      <p className="lp-sfsub">do limite anual usado</p>
                    </div>
                  </div>
                  <div className="lp-sfsaldo">
                    Você ainda pode vender<b>R$ 17.820</b>
                  </div>
                  <div className="lp-fld" style={{ marginTop: 12 }}>
                    <span className="k">Limite anual</span>
                    <span>R$ 81.000</span>
                  </div>
                  <div className="lp-fld">
                    <span className="k">Já faturado</span>
                    <span>R$ 63.180</span>
                  </div>
                </div>
              </div>
              <p className="lp-shotcap">🚦 Seu semáforo</p>
            </div>

            {/* Tela 2 — Lançar */}
            <div>
              <div className="lp-phone">
                <div className="lp-screen">
                  <p className="lp-appbar">Nova venda</p>
                  <p className="lp-pttl">Lançar receita</p>
                  <div className="lp-fld">
                    <span className="k">Valor</span>
                    <span>
                      <b>R$ 250,00</b>
                    </span>
                  </div>
                  <div className="lp-fld">
                    <span className="k">Data</span>
                    <span>27/06/2026</span>
                  </div>
                  <p
                    className="lp-pttl"
                    style={{ fontSize: 11, color: "#94A3B8", margin: "4px 0 6px" }}
                  >
                    Forma de pagamento
                  </p>
                  <div className="lp-chips">
                    <span className="sel">PIX</span>
                    <span>Dinheiro</span>
                    <span>Cartão</span>
                  </div>
                  <div className="lp-appbtn">Salvar lançamento</div>
                </div>
              </div>
              <p className="lp-shotcap">✍️ Lançar em 3 toques</p>
            </div>

            {/* Tela 3 — Relatório */}
            <div>
              <div className="lp-phone">
                <div className="lp-screen">
                  <p className="lp-appbar">Relatório</p>
                  <p className="lp-pttl">Resumo do ano · 2026</p>
                  <div className="lp-prow">
                    <span>Receitas</span>
                    <b className="g">R$ 63.180</b>
                  </div>
                  <div className="lp-prow">
                    <span>Despesas</span>
                    <b className="r">R$ 11.430</b>
                  </div>
                  <div className="lp-prow">
                    <span>Saldo líquido</span>
                    <b>R$ 51.750</b>
                  </div>
                  <div className="lp-prow">
                    <span>% do limite</span>
                    <b>78%</b>
                  </div>
                  <div className="lp-appbtn wa" style={{ marginTop: 14 }}>
                    Enviar pro contador
                  </div>
                  <p className="lp-sfsub" style={{ textAlign: "center", marginTop: 8 }}>
                    Link abre sem login
                  </p>
                </div>
              </div>
              <p className="lp-shotcap">📄 Relatório num toque</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EQUAÇÃO DE VALOR ===================== */}
      <section className="lp-sec lp-center">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Por que funciona pra você</div>
          <h2 className="lp-title">Mesmo se você &quot;não é boa de tecnologia&quot;</h2>
          <div className="lp-cards lp-c4">
            <div className="lp-card">
              <h3>🎯 Resultado</h3>
              <p>Dormir tranquila, nunca mais ser pega de surpresa.</p>
            </div>
            <div className="lp-card">
              <h3>✅ Confiança</h3>
              <p>À prova de leigo + regra automática + garantia de 30 dias.</p>
            </div>
            <div className="lp-card">
              <h3>⚡ Rapidez</h3>
              <p>Sua primeira cor em 2 minutos.</p>
            </div>
            <div className="lp-card">
              <h3>🪶 Esforço</h3>
              <p>3 toques. Sem instalar. Sem imposto pra entender.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== O QUE VOCÊ RECEBE (BÔNUS) ===================== */}
      <section className="lp-dark2 lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Tudo que entra no seu Acesso Fundador</div>
          <h2 className="lp-title">O app completo + 7 bônus</h2>
          <p className="lp-lead">
            O app MEI no Limite completo (Semáforo, saldo do ano, alerta amarelo,
            relatório pro contador) — mais:
          </p>
          <div className="lp-cards lp-c2" style={{ marginTop: 24 }}>
            {[
              { t: "🎁 Raio-X do Seu Ano", v: "R$ 297", d: "Projeção de onde você fecha dezembro." },
              { t: "🎁 Pasta do Contador Pronta", v: "R$ 397", d: "Relatório done-for-you, num toque." },
              { t: "🎁 Lembrete que Não Deixa Esquecer", v: "R$ 247", d: "Alerta diário no WhatsApp." },
              { t: "🎁 Destravada em 3 Minutos", v: "R$ 197", d: "Mini-treino sem imposto." },
              { t: "🎁 Guia dos 3 Meses que Mais Derrubam MEI", v: "R$ 197", d: "Mães, Black Friday, Natal." },
              { t: "🎁 Veja Antes de Confiar", v: "R$ 297", d: "Demo + seu número antes de pagar." },
              { t: "🎁 Acesso Fundador Vitalício", v: "R$ 215", d: "Preço travado pra sempre." },
            ].map((b) => (
              <div className="lp-card" key={b.t}>
                <h3>
                  {b.t}{" "}
                  <span style={{ color: "#94A3B8", fontWeight: 400 }}>({b.v})</span>
                </h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
          <p
            className="lp-lead"
            style={{ marginTop: 22, fontSize: 20, color: "#fff" }}
          >
            <b>Valor total dos bônus: R$ 1.847.</b> Tudo dentro dos R$ 27,90/mês.
          </p>
        </div>
      </section>

      {/* ===================== PREÇO ===================== */}
      <section className="lp-preco lp-sec lp-center" id="preco">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Quanto vale nunca mais ser pega de surpresa?</div>
          <h2 className="lp-title">O preço de Fundador</h2>
          <div className="lp-cascata">
            <div className="lp-casc red">
              <span className="k">O prejuízo que você evita</span>
              <span className="v">R$ 15.000</span>
            </div>
            <div className="lp-casc del">
              <span className="k">Só em bônus</span>
              <span className="v">R$ 1.847</span>
            </div>
            <div className="lp-casc del">
              <span className="k">Preço cheio</span>
              <span className="v">R$ 87,90/mês</span>
            </div>
            <div className="lp-casc win">
              <span className="k">Seu preço de Fundador</span>
              <span className="v">R$ 27,90/mês</span>
            </div>
          </div>
          <div className="lp-precobox">
            <p className="lp-lead" style={{ margin: "0 auto" }}>
              Plano anual de R$ 334,80 à vista no cartão (ou 12x de R$ 27,90).
            </p>
            <p className="dia">= R$ 0,93 por dia. Menos que um café.</p>
            <a
              href={CHECKOUT_URL}
              className="lp-btn lp-btn-lg"
              style={{ marginTop: 12 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Garantir meu acesso de fundador
            </a>
          </div>
        </div>
      </section>

      {/* ===================== GARANTIA ===================== */}
      <section className="lp-alt lp-sec lp-center">
        <div className="lp-wrap">
          <div className="lp-selo">
            GARANTIA
            <br />
            30 DIAS
          </div>
          <h2 className="lp-title">O risco é todo meu.</h2>
          <p className="lp-lead">
            Use por 30 dias. Se você não souber exatamente quanto ainda pode
            vender este ano, devolvo cada centavo. Sem pergunta, sem letra miúda.
          </p>
        </div>
      </section>

      {/* ===================== ESCASSEZ + URGÊNCIA ===================== */}
      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow">Por que decidir agora</div>
          <h2 className="lp-title">As duas razões são reais</h2>
          <div className="lp-urg">
            <div className="lp-card">
              <h3>🔒 Vagas</h3>
              <p>
                Os 300 primeiros travam <b>R$ 27,90 pra sempre</b>. Quando o
                preço voltar pra R$ 87,90, você continua no de fundador.{" "}
                <b>Restam {vagasRestantes} de {vagasTotal}.</b>
              </p>
            </div>
            <div className="lp-card">
              <h3>⏳ Tempo</h3>
              <p>
                Faltam <b>{diasFimAno}</b> dias pro fim do ano fiscal — e o
                estrago do limite é <b>retroativo a janeiro</b>. Descobrir em
                dezembro é descobrir tarde demais.
              </p>
            </div>
          </div>
          <p
            className="lp-lead"
            style={{ marginTop: 22, fontSize: 19, color: "#fff" }}
          >
            <b>
              O preço só fica barato pros 300 primeiros, e o risco só cresce a
              cada mês. Esperar perde nos dois.
            </b>
          </p>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="lp-dark2 lp-sec">
        <div className="lp-wrap">
          <div className="lp-eyebrow lp-center" style={{ textAlign: "center" }}>
            Ainda na dúvida?
          </div>
          <h2 className="lp-title lp-center">Perguntas que todo MEI faz</h2>
          <div className="lp-faq">
            {[
              {
                q: "“Eu controlo na planilha.”",
                a: "Ela te responde agora quanto ainda pode vender e te avisa antes? Não. O Semáforo soma sozinho e acende o amarelo — sempre em dia, sem você manter nada.",
              },
              {
                q: "“Meu contador já cuida disso.”",
                a: "O contador liga em janeiro, tarde demais. O app não substitui o contador, ele alimenta: manda a Pasta do Contador num toque e te avisa no amarelo, não só no vermelho.",
              },
              {
                q: "“Não sou boa de tecnologia.”",
                a: "Foi feito pra quem não entende de imposto nem de app: 3 toques, sem instalar, com mini-treino de 3 minutos. Se você usa WhatsApp, você usa isso.",
              },
              {
                q: "“Não vou estourar mesmo.”",
                a: "Quase ninguém acha que vai — até estourar. R$ 81 mil por ano são só R$ 6.750 por mês. O Raio-X do Seu Ano mostra, com o SEU número, onde você fecha dezembro.",
              },
              {
                q: "“É mais uma assinatura.”",
                a: "R$ 0,93 por dia, 2% de um risco de R$ 15.000. E com a garantia, você testa de graça — não gasta.",
              },
              {
                q: "“Vou pensar.”",
                a: "Pensa rápido, pelo calendário: o risco é retroativo a janeiro e a vaga de fundador pode não estar lá quando você voltar. Esperar perde nos dois.",
              },
            ].map((item) => (
              <details className="lp-q" key={item.q}>
                <summary>{item.q}</summary>
                <div className="lp-a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="lp-final lp-sec">
        <div className="lp-wrap">
          <h2 className="lp-title">
            Pare de vender com medo. Comece a vender sabendo.
          </h2>
          <p className="lp-lead" style={{ margin: "0 auto 8px" }}>
            Seu número em 2 minutos · avisada antes de estourar · R$ 0,93/dia ·
            garantia de 30 dias.
          </p>
          <a
            href={CHECKOUT_URL}
            className="lp-btn lp-btn-lg"
            style={{ marginTop: 16 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Travar meu preço de fundador agora
          </a>
          <p className="lp-micro">
            Restam {vagasRestantes} de {vagasTotal} vagas.
          </p>
          <p className="lp-micro">
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "#16A34A", fontWeight: 700 }}>
              Entrar →
            </Link>
          </p>
        </div>
      </section>

      {/* ===================== RODAPÉ ===================== */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-semaforo" style={{ marginBottom: 10 }}>
            <span className="lp-s-g" />
            <span className="lp-s-a" />
            <span className="lp-s-r" />
          </div>
          <div>MEI no Limite — by H9 Consultoria · meinolimite.com.br · © 2026</div>
          <p style={{ fontSize: 12, color: "#64748B", marginTop: 10 }}>
            O MEI no Limite é uma ferramenta de controle de faturamento e não
            substitui a contabilidade oficial.
          </p>
        </div>
      </footer>

      {/* CTA fixo no mobile */}
      <div className="lp-sticky">
        <a
          href={CHECKOUT_URL}
          className="lp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Quero saber meu número — R$ 0,93/dia
        </a>
      </div>
    </div>
  );
}
