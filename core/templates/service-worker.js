const CACHE_NAME = 'kf-v1';

const urlsToCache = [
    '/',
    'offline.html',
    '/api/weather/',
    '/api/products/',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
           .then(cache => cache.addAll(urlsToCache))
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
           .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.filter(cacheName => !cacheWhitelist.includes(cacheName)).map(cacheName => caches.delete(cacheName))
            )
        )
    );
})
