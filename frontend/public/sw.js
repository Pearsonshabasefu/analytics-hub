// RefineIQ Service Worker v1.0.0
const CACHE_NAME = 'refineiq-cache-v1'
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
]

// Install event - precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    }).then(() => self.skipWaiting())
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Do not intercept external analytics or API calls
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful static responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic' &&
          (url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.woff2'))
        ) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // If HTML navigation request fails, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          return new Response('Network offline', { status: 503, statusText: 'Service Unavailable' })
        })
      })
  )
})
