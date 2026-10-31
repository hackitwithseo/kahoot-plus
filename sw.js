const C = 'khp3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (new URL(r.url).origin !== location.origin) return;

  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then(x => { caches.open(C).then(c => c.put(r, x.clone())); return x; })
              .catch(() => caches.match(r).then(x => x || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(hit => hit || fetch(r).then(x => { caches.open(C).then(c => c.put(r, x.clone())); return x; }))
  );
});