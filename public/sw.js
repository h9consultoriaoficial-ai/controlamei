// Service worker básico — MEI no Limite
// Estratégia: network-first para navegação (sempre tenta o conteúdo mais
// novo) com fallback offline; cache-first para estáticos. Não intercepta
// requisições de outra origem (ex.: Supabase) nem métodos != GET.

const CACHE = "mei-no-limite-v1";
const PRECACHE = [
  "/",
  "/login",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // não mexe em Supabase etc.

  // Navegação (páginas): network-first, fallback para cache/offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/"))
      )
    );
    return;
  }

  // Estáticos: cache-first, com atualização em segundo plano.
  event.respondWith(
    caches.match(request).then((cached) => {
      const rede = fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            const copia = resp.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copia));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || rede;
    })
  );
});
