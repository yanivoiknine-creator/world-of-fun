// ===== Service Worker - עולם של כייף =====
const CACHE_NAME = 'olam-shel-kayif-v1';

// קבצים שנשמרים מיד כשהאפליקציה נטענת לראשונה
const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './script.js',
  './a11y.js',
  './logos/logo.png',
  './logos/icon-192.png',
  './logos/icon-512.png',
  './games.html',
  './drawing.html',
  './chess.html',
  './checkers.html',
  './memory.html',
  './flappy.html',
  './rps.html',
];

// Install: שמירת הקבצים הבסיסיים ב-cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: מחיקת cache ישן
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache ראשון, אחר כך רשת
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // כשאין אינטרנט - חזרה לדף הבית
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
