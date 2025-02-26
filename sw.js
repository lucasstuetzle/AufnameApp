// Name des Caches (bleibt konstant, da keine manuelle Versionierung erfolgen soll)
const CACHE_NAME = 'my-cache';

// INSTALL-Ereignis: Wird ausgeführt, wenn der Service Worker installiert wird.
// Hier werden zunächst einige essentielle Dateien vorab in den Cache geladen.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Pre-caching der Ressourcen');
      return cache.addAll([
        'https://lucasstuetzle.github.io/AufnameApp/index.html',              // Startseite
        'https://lucasstuetzle.github.io/AufnameApp/css/style.css',            // CSS-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/Berechnung-kWh.js',     // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/speicher.js',           // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/manifest.json',            // Manifest-Datei
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png',   // Icon (192x192)
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-512x512.png'    // Icon (512x512)
      ]);
    })
  );
});

// AKTIVIEREN-Ereignis: Wird ausgeführt, wenn der Service Worker aktiviert wird.
// Hier werden alle Caches gelöscht, die nicht dem aktuellen CACHE_NAME entsprechen.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Service Worker: Lösche alten Cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// FETCH-Ereignis: Wird bei jeder Netzwerkanfrage ausgelöst.
// Hier wird ein "Network-first"-Ansatz verwendet: Zuerst wird versucht, die Ressource aus dem Netzwerk zu holen.
// Wenn die Netzwerkabfrage fehlschlägt, wird die Ressource aus dem Cache zurückgegeben.
self.addEventListener('fetch', event => {
  console.log(`Service Worker: Anfrage für ${event.request.url}`);

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        console.log(`Service Worker: Lade ${event.request.url} aus dem Netzwerk`);
        
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());  // Antwort im Cache speichern
          return networkResponse;  // Antwort an den Browser zurückgeben
        });
      })
      .catch(() => {
        console.log(`Service Worker: Lade ${event.request.url} aus dem Cache (Netzwerkfehler)`);
        return caches.match(event.request);  // Fallback auf Cache
      })
  );
});
