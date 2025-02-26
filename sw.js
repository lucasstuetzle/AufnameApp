const CACHE_NAME = 'my-cache-v1'; // Version des Caches
const CACHE_URLS = [
  './Übersicht.html',
  './css/style.css',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './js/Berechnung-kWh.js',
  './js/speicher.js'
];

// Installiere den Service Worker und cache die wichtigen Dateien
self.addEventListener('install', function(event) {
  console.log('Service Worker installiert');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching wichtige Dateien');
      return cache.addAll(CACHE_URLS); // Speichere die Dateien im Cache
    })
  );
});

// Aktiviere den Service Worker und lösche alte Caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker aktiviert');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Alten Cache löschen:', cacheName);
            return caches.delete(cacheName); // Lösche alte Caches
          }
        })
      );
    })
  );
});

// Reagiere auf Fetch-Events und lade entweder aus dem Cache oder dem Netzwerk
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      // Wenn die Datei im Netzwerk verfügbar ist, cache sie für zukünftige Anfragen
      return caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch(function() {
      // Wenn der Netzwerkaufruf fehlschlägt (z.B. bei Offline-Nutzung), hole die Datei aus dem Cache
      return caches.match(event.request).then(function(response) {
        // Rückfall: Wenn die Datei nicht im Cache vorhanden ist, zurück zur Startseite
        return response || caches.match('./Übersicht.html');
      });
    })
  );
});

// Event für das Hinzufügen der PWA zum Home-Bildschirm
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt Event ausgelöst');
  event.preventDefault();
  // Hier kannst du dann das Event auslösen, wenn du die Installation manuell anbieten möchtest
  // z.B. einen Button anzeigen oder das Event speichern, um später den Prompt zu zeigen
  let deferredPrompt = event;
  
  // Beispiel: Eine Funktion zum Zeigen des Installations-Prompts
  const installButton = document.getElementById('installButton');
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome);
      deferredPrompt = null;
    });
  });
});
