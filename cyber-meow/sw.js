/* 赛博喵 service worker — works offline after the first visit */
const VERSION = 'cybermeow-v9';
const SHELL = [
  './', './index.html', './style.css', './cat.js', './art.js', './scenes.js', './game.js', './lab.html',
  './manifest.webmanifest',
  './fonts/zcool-kuaile.woff', './fonts/silkscreen-400.woff', './fonts/silkscreen-700.woff',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // pages: network first so updates arrive; fall back to cache offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => { caches.open(VERSION).then((c) => c.put(req, res.clone())); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  // assets: cache first, refresh in the background
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone())); return res; }).catch(() => hit);
      return hit || net;
    })
  );
});
