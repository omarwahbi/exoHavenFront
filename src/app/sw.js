// Service worker source, compiled to public/sw.js by @serwist/next.
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Remove caches left behind by the previous next-pwa (Workbox) service worker that
// Serwist does not reuse: its precache and its "start-url" runtime cache.
const isLegacyCache = (key) => key.startsWith("workbox-precache") || key === "start-url";

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(isLegacyCache).map((key) => caches.delete(key))))
  );
});
