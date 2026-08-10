"use client";

import { useEffect, type RefObject } from "react";

/** Calls `onIntersect` when the element scrolls into view — the infinite-scroll trigger. */
export function useIntersection(
  ref: RefObject<HTMLElement | null>,
  onIntersect: () => void,
  enabled = true
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      // Fires while the element is still a screenful away, so the fetch is already
      // in flight by the time the user reaches it.
      { rootMargin: "300px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, onIntersect, enabled]);
}
