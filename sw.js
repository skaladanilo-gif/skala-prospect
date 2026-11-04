// Skala Prospect: abre rápido e funciona com internet fraca.
// Página e dados criptografados: rede primeiro, cópia guardada se a rede falhar.
// Supabase e outros sites nunca passam por aqui.
const CACHE = "skala-prospect-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "icon.svg", "manifest.webmanifest"]))); });
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const r = await fetch(e.request);
      if (r.ok) c.put(e.request, r.clone());
      return r;
    } catch {
      return (await c.match(e.request)) ?? (await c.match("./")) ?? Response.error();
    }
  })());
});
