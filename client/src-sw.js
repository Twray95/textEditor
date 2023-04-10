const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching

// this.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open("page-cache").then((cache) => cache.add("/index.html"))
//   );
// });

// window.addEventListener("load", () => {
//   navigator.serviceWorker.register("/src-sw.js");
// });

const urlsToCache = [
  "/",
  "index.html",
  "main.bundle.js",
  "install.bundle.js",
  "main.css",
  "/icons",
];
self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    const cache = await caches.open("page-cache");
    return cache.addAll(urlsToCache);
  });
});
