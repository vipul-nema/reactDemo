// ServiceWorker is a progressive technology. Ignore unsupported browsers
if ("serviceWorker" in navigator) {
  console.log("CLIENT: service worker registration in progress.");
  navigator.serviceWorker.register("https://vipul-nema.github.io/reactDemo/service-worker.js").then(
    function() {
      console.log("CLIENT: service worker registration complete.");
    },
    function() {
      console.log("CLIENT: service worker registration failure.");
    }
  );

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // This fires when the service worker controlling this page
    // changes, eg a new worker has skipped waiting and become
    // the new active worker.
    console.log("service worker controlling this page has changed and updated");
  });
} else {
  console.log("CLIENT: service worker is not supported.");
}
