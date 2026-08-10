"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The rendered width of an element, kept current as it changes.
 *
 * Charts need real pixels, not a scaled viewBox: stretching one viewBox to fit
 * scales the type along with the geometry, so a 12px axis label lands at 6px on a
 * phone. Laying out against the measured width keeps text at its own size.
 *
 * Zero until the first measurement — callers should hold off drawing until then.
 */
export function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}
