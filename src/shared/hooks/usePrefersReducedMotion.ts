"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const store = {
  subscribe(onChange: () => void) {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  },
  getSnapshot: () => window.matchMedia(QUERY).matches,
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
