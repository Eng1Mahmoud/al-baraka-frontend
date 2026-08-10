"use client";

import { useEffect } from "react";

/** Registers the worker in production, and tears down stale ones in development. */
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
