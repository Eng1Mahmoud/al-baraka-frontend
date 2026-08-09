"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * One MediaQueryList for the whole app, made on first use.
 *
 * `getSnapshot` runs on every render of every component that calls this — the home
 * page has one slider per category — and React may call it more than once per render
 * while it checks the store is consistent. Building a fresh MediaQueryList each time
 * was pure waste; the object is immutable and answers the same query for everyone.
 */
let media: MediaQueryList | null = null;
const getMedia = () => (media ??= window.matchMedia(QUERY));

const store = {
  subscribe(onChange: () => void) {
    const list = getMedia();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  },
  getSnapshot: () => getMedia().matches,
};

/**
 * Whether the visitor has asked their system to keep motion down.
 *
 * For animation a stylesheet can't reach: a CSS `@media` block can turn off a
 * transition, but not a carousel that moves the rail from JavaScript one frame at a
 * time. Those have to ask.
 *
 * Assumes motion is fine on the server, which is the safe way round — the reader who
 * needs it off gets it off on the first client render, before anything has moved.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
