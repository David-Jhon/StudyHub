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

  if (event.request.method === 'POST' && url.pathname === '/') {
    event.respondWith(caches.match('/'));
    event.waitUntil(async function () {
      try {
        const formData = await event.request.formData();
        const files = formData.getAll('files');
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        
        let client = null;
        // Try to find a visible client
        for (const c of clientList) {
          if (c.visibilityState === 'visible') {
            client = c;
            break;
          }
        }
        // If no visible client, just take the first one
        if (!client && clientList.length > 0) {
          client = clientList[0];
        }

        if (client) {
          // Focus the client and then post the message
          await client.focus();
          client.postMessage({ action: 'share', files });
        } else {
          // If no clients are open, open a new window
          self.clients.openWindow('/');
        }
      } catch (e) {
        console.error('Share target error:', e);
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
