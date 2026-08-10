"use client";

import { useEffect, type RefObject } from "react";

type ElementRef = RefObject<HTMLElement | null>;

/**
 * Calls `onIntersect` when the element scrolls into view — the infinite-scroll trigger.
 *
 * `onIntersect` must be referentially stable. Observing fires the callback immediately
 * with the current state, so a new function identity each render would tear the
 * observer down and rebuild it, re-firing every time and looping.
 */
export function useIntersection(
  ref: ElementRef,
  onIntersect: () => void,
  enabled = true,
  /**
   * The scrolling ancestor, when the list scrolls inside a bounded box rather than
   * with the page. Left out, the viewport is the reference — but then a sentinel
   * clipped by that box only counts as visible once it is genuinely on screen, so
   * the margin below buys nothing and the next page arrives late.
   */
  rootRef?: ElementRef
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      {
        root: rootRef?.current ?? null,
        // Fires while the element is still a screenful away, so the fetch is already
        // in flight by the time the user reaches it.
        rootMargin: "300px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, onIntersect, enabled, rootRef]);
}
