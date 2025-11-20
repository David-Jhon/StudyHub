import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { set } from 'idb-keyval'



cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)

    if (url.pathname === '/share-target' && event.request.method === 'POST') {
        event.respondWith(
            (async () => {
                const formData = await event.request.formData()
                const file = formData.get('file')
                const title = formData.get('title') || formData.get('text') || ''

                if (file) {
                    // Store the file in IndexedDB so the UI can pick it up
                    await set('shared-file', { file, title, timestamp: Date.now() })
                }

                // Redirect to the root to open the app
                return Response.redirect('/', 303)
            })()
        )
    }
})
