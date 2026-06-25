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
    // Fixo no rodapé em TODOS os tamanhos. No desktop, a barra fica
    // centralizada com largura máxima de 480px (mesmo visual do mobile).
    <nav className="fixed inset-x-0 bottom-0 z-10">
      <div className="mx-auto flex w-full max-w-[480px] items-stretch justify-around border-t border-gray-100 bg-white px-2">
        {itens.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors ${
                ativo ? "text-primary" : "text-gray-400 hover:text-primary"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
