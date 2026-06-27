import Link from "next/link";
import Image from "next/image";

// Link de checkout da Cakto. Defina NEXT_PUBLIC_CAKTO_CHECKOUT_URL na Vercel
// com o link real do produto; o placeholder abaixo é só fallback.
const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL ||
  "https://pay.cakto.com.br/bap6dvn_945227";

export const metadata = {
  title: "Ative seu acesso — MEI no Limite",
};

export default function AssinarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0E0C] px-5 py-12 text-center text-[#F4F4F6]">
      <div className="w-full max-w-md">
        <Image
          src="/logo/horizontal-dark.svg"
          alt="MEI no Limite"
          width={1024}
          height={463}
          priority
          unoptimized
          className="mx-auto h-10 w-auto"
        />

        <h1 className="mt-10 text-3xl font-extrabold tracking-tight">
          Ative seu acesso
        </h1>
        <p className="mt-4 text-[#A0A0B0]">
          Para usar o MEI no Limite, assine o plano Fundador por R$ 27,90/mês.
        </p>

        <div className="mt-8 rounded-2xl border-2 border-[#39D98A] bg-[#39D98A]/[0.08] p-7">
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-lg text-[#A0A0B0] line-through">R$ 87,90</span>
            <span className="text-5xl font-extrabold text-[#39D98A]">
              R$ 27,90
              <span className="text-2xl font-bold">/mês</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-[#A0A0B0]">
            Plano anual · R$ 334,80 · Trava de preço vitalícia
          </p>

          <a
            href={CHECKOUT_URL}
            className="btn-lp mt-6 w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Assinar agora →
          </a>

          <p className="mt-4 text-sm font-semibold text-[#39D98A]">
            🛡️ 30 dias ou seu dinheiro de volta
          </p>
        </div>

        <p className="mt-6 text-sm text-[#A0A0B0]">
          Já assinei,{" "}
          <Link href="/login" className="font-semibold text-[#39D98A] hover:underline">
            entrar →
          </Link>
        </p>
      </div>
    </main>
  );
}
