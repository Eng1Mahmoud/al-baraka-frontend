"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that powers offline caching and push notifications.
 *
 * Only in production. In development the worker is actively harmful: it serves
 * `/_next/static` chunks cache-first, and dev chunk filenames repeat between builds,
 * so an edited page keeps rendering the previous build's JavaScript. Any worker left
 * over from a previous run is unregistered and its caches dropped.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((registration) => registration.unregister()))
        .catch(() => undefined);

      caches
        ?.keys()
        .then((keys) => keys.forEach((key) => caches.delete(key)))
        .catch(() => undefined);

      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => console.error("Service worker registration failed:", error));
  }, []);

  return null;
}
