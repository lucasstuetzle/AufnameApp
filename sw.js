const CACHE_NAME = 'my-cache';  // Einfacher Name, ohne Versionierung

// Installieren und Ressourcen in den Cache hinzufügen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cache wird hinzugefügt');
      return cache.addAll([
        'https://lucasstuetzle.github.io/AufnameApp/index.html',              // Index-Seite
        'https://lucasstuetzle.github.io/AufnameApp/css/style.css',           // CSS-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/Berechnung-kWh.js',    // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/speicher.js',          // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/manifest.json',           // Manifest-Datei
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png',  // 192px Icon
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-512x512.png'   // 512px Icon
      ]);
    })
  );
});

// Aktivieren des Service Workers und Entfernen alter Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {  // Lösche alte Caches, wenn sie nicht dem aktuellen Namen entsprechen
            console.log(`Service Worker: Lösche alten Cache ${cacheName}`);
            return caches.delete(cacheName);  // Lösche den alten Cache
          }
        })
      );
    })
  );
});

// Fetch-Ereignis und Rückgabe von gecachten Inhalten
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Falls die Anfrage im Cache gefunden wurde, gebe sie zurück
      return response || fetch(event.request);  // Ansonsten lade sie aus dem Netzwerk
    })
  );
});
