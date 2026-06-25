"use client";

import { useEffect } from "react";

/**
 * Registra o service worker (/sw.js) após o carregamento da página.
 * Renderiza nada — é só um efeito colateral no cliente.
 */
export default function RegistrarSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const registrar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha silenciosa: o app funciona normalmente sem o SW.
      });
    };
    if (document.readyState === "complete") {
      registrar();
    } else {
      window.addEventListener("load", registrar);
      return () => window.removeEventListener("load", registrar);
    }
  }, []);

  return null;
}
