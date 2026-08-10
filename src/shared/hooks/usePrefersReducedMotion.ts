"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

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

export function usePrefersReducedMotion() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
