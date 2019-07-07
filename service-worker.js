var currentCacheName = "sw-demo_v1";
self.addEventListener("install", function(event) {
  console.log("WORKER: install event in progress.");
});

self.addEventListener("activate", function(event) {
  console.log("WORKER: activate event in progress.");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            if (cacheName !== currentCacheName) {
              return true;
            }
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log("WORKER: fetch event in progress.", event.request.url);
  event.respondWith(
    caches.open(currentCacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (
          response ||
          fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
});
