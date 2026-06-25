import Link from "next/link";
import Logo from "@/components/Logo";
import AppNav from "@/components/AppNav";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/app">
            <Logo size="sm" />
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm font-semibold text-gray-500 hover:text-primary"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-6">{children}</main>

      <AppNav />
    </div>
  );
}
