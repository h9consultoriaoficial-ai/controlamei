import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-3xl font-extrabold text-gray-900">
        Página não encontrada
      </h1>
      <p className="mt-2 text-gray-500">
        O link pode estar errado ou ter expirado.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Voltar ao início
      </Link>
    </main>
  );
}
