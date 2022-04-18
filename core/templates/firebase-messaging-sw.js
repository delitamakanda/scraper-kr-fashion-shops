importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '946790860424'
});

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[sw.js] Received background message ', payload);

    payload = payload.data;
    var notificationTitle = payload.title;
    var notificationOptions = {
        body: payload.body,
        icon: payload.icon_url,
    };

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        clients.openWindow(payload.url);
    });

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

var cacheName = 'shop-v2';
var cacheFiles = [
    'https://cdn.tailwindcss.com/',
    'https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js',
    '/static/manifest.json',
    '/offline.html',
    new RegExp('^https://cafe24img.poxo.com/mbaby/web/product/tiny/')
];
var CURRENT_CACHES = {
    offline: 'offline-shop-v2'
};

var OFFLINE_URL = '/offline.html';

self.addEventListener('install', function (e) {
    e.waitUntil(
        fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (response) {
            return caches.open(CURRENT_CACHES.offline).then(function (cache) {
                console.log('[ServiceWorker] Caching cacheFiles');
                return cache.put(OFFLINE_URL, response);
            })
        })
    )

    function createCacheBustedRequest(url) {
        var request = new Request(url, { cache: 'reload' });
        if ('cache' in request) {
            return request;
        }
        var bustedUrl = new URL(url, self.location.href);
        bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
        return new Request(bustedUrl);
    }
});

self.addEventListener('activate', function (e) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {

                        console.log('[ServiceWorker] Removing Cached Files from Cache - ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' &&
            event.request.headers.get('accept').includes('text/html'))) {

        event.respondWith(
            fetch(event.request).catch(function (error) {
                return caches.match(OFFLINE_URL);
            })
        )
    }
});