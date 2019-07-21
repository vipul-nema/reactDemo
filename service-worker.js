var currentCacheName = "sw-demo_v2";

var urlsToCache = ["./", "./main.css", "./like_button.js"];
self.addEventListener("install", function(event) {
  console.log("WORKER: install event in progress.");
  //self.skipWaiting() prevents the waiting, meaning the service worker activates as soon as it's finished installing.
  //This means some of your page's fetches will have been handled by your old service worker,
  // but your new service worker will be handling subsequent fetches.
  //If this might break things, don't use skipWaiting().
  event.waitUntil(
    caches.open(currentCacheName).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
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
  //You can take control of uncontrolled clients by calling clients.claim()
  // within your service worker once it's activated.
  clients.claim();
});

self.addEventListener("fetch", function(event) {
  console.log("WORKER: fetch event in progress.", event.request.url);
  var request = event.request;
  event.respondWith(
    caches.open(currentCacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var corsRequest;
        if (request.mode !== "cors") {
          corsRequest = new Request(request, {
            mode: "cors",
            credentials: "omit" // include, *same-origin, omit
          });
        } else {
          // Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the request.
          corsRequest = request.clone();
        }

        return (
          response ||
          fetch(corsRequest).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
});
