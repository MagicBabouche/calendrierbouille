// Mode hors ligne : on sert la copie en cache et on la met à jour en arrière-plan.
// (La progression est dans le localStorage, elle n'est jamais touchée par ce fichier.)
const CACHE = 'bouille-v1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/favicon.svg', 'icons/favicon-32.png', 'icons/favicon-48.png',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(cache => cache.match(e.request, {ignoreSearch: true}).then(hit => {
    const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
