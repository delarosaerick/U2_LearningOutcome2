var cacheName = 'weatherPWA-v1';
var filesToCache = [
    './',
    './index.html',
    './scripts/app.js',
    './scripts/localforage-1.4.0.js',
    './styles/ud811.css',
    './images/clear.png',
    './images/cloudy-scattered-showers.png',
    './images/cloudy.png',
    './images/fog.png',
    './images/ic_add_white_24px.svg',
    './images/ic_refresh_white_24px.svg',
    './images/partly-cloudy.png',
    './images/rain.png',
    './images/scattered-showers.png',
    './images/sleet.png',
    './images/snow.png',
    './images/thunderstorm.png',
    './images/wind.png'
];


// GENERAL - waitUntil() ensures that the service worker will not install until the code inside it has successfully occurred //

// We use the caches.open() method to create a new cache, which will be a version of our site resources cache.
// We call the addAll() function, which takes the resources you want to cache, in this case the resources are on the array of 'filesToCache'.
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

// This is useful for removing data that is no longer needed, like as an previous version while it was still running.
// Our clean-up operation will have completed by the time you get your first fetch event on the new service worker.
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                }
            }));
        })
    );
});


/* This allows us to match each resource requested from the network with the equivalent resource available in the cache,
if there is a matching one available. */
// If the resources aren't in the cache, they are requested from the network.
self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fecth', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});