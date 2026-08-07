/* Al-Baraka service worker: offline shell + order push notifications. */

const CACHE_NAME = "al-baraka-v2";
const OFFLINE_URLS = ["/", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // Cached one by one: with addAll a single 404 rejects the whole install,
      // leaving the site without a service worker (and not installable).
      .then((cache) =>
        Promise.all(
          OFFLINE_URLS.map((url) =>
            cache.add(url).catch((error) => console.warn("skipped precache", url, error))
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page loads always go to the network so a new deploy is picked up immediately.
  // Their HTML is deliberately NOT cached per-URL: stale HTML points at JS chunks
  // that no longer exist after a deploy, which breaks the page. Offline falls back
  // to the cached home shell instead.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/").then((cached) => cached ?? Response.error()))
    );
    return;
  }

  // Everything else — build assets, icons, fonts — is content-hashed or static,
  // so a cache hit is always safe.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok && (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons"))) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});

// A new order arrived while the dashboard tab was closed or the screen was off.
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "البركة", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "طلب جديد", {
      body: payload.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      dir: "rtl",
      lang: "ar",
      vibrate: [200, 100, 200],
      tag: "new-order",
      renotify: true,
      data: { url: payload.url || "/dashboard/orders" },
    })
  );
});

// Focus an already-open dashboard tab instead of piling up new windows.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard/orders";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
