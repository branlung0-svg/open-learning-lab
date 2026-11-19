// Offline support: pages, scripts and pictures you have opened are kept so the Lab works without a connection.
// HTML: network first, cache as fallback. Versioned scripts/styles (?v=): cache first. Pictures and data: cache, refresh in background.
const CACHE = 'lab-v2';
const PIC_LIMIT = 900;
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html']).catch(() => {}))); });
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
const trim = async (c) => { const ks = (await c.keys()).filter((r) => /\/img\//.test(r.url)); for (let i = 0; i < ks.length - PIC_LIMIT; i++) await c.delete(ks[i]); };
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return; const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r, { cache: 'no-cache' }).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); return res; }).catch(() => caches.match('./index.html'))); return; }
  if (/[?&]v=\d+/.test(u.search)) { e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; }))); return; }
  if (/\/data\/.*\.json$/.test(u.pathname)) { e.respondWith(fetch(r, { cache: 'no-cache' }).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; }).catch(() => caches.match(r))); return; }
  if (/\/(img|data)\//.test(u.pathname)) { e.respondWith(caches.open(CACHE).then(async (c) => { const hit = await c.match(r); const net = fetch(r).then((res) => { if (res.ok && res.status === 200) { c.put(r, res.clone()); if (/\/img\//.test(u.pathname)) trim(c); } return res; }).catch(() => hit); return hit || net; })); }
});
