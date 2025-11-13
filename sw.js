const CACHE_NAME = 'studyhub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/config.js',
  '/manifest.json',
  '/assets/icons/icon.svg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/aos@2.3.4/dist/aos.css',
  'https://unpkg.com/aos@2.3.4/dist/aos.js',
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/share-target') {
    event.respondWith(Response.redirect('/'));
    event.waitUntil(async function () {
      const formData = await event.request.formData();
      const files = formData.getAll('files');
      const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      if (clientList.length > 0) {
        clientList[0].postMessage({ action: 'share', files });
      }
    }());
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
