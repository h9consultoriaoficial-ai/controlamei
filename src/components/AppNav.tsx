"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/app", label: "Lançar", icon: "🚦" },
  { href: "/app/historico", label: "Histórico", icon: "📊" },
  { href: "/app/relatorio", label: "Relatório", icon: "📤" },
  { href: "/app/perfil", label: "Perfil", icon: "👤" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white sm:static sm:mx-auto sm:mt-4 sm:max-w-3xl sm:border-none sm:bg-transparent">
      <div className="mx-auto flex w-full max-w-3xl items-stretch justify-around px-2 sm:justify-center sm:gap-2">
        {itens.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors sm:flex-none sm:flex-row sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm ${
                ativo
                  ? "text-primary sm:bg-primary sm:text-white"
                  : "text-gray-400 hover:text-primary sm:text-gray-600"
              }`}
            >
              <span className="text-lg sm:text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
