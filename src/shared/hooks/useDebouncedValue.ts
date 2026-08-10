"use client";

import { useEffect, useState } from "react";

/** Long enough to swallow a burst of typing, short enough not to feel unresponsive. */
export const DEBOUNCE_MS = 500;

/**
 * Mirrors `value`, but only once it has stopped changing for `delay` milliseconds.
 *
 * The point is to separate what the user is doing from what the app acts on. A search
 * term feeds a query key, so without this a six-letter word is six requests to show
 * one result — five of them already stale when they land. The field itself stays on
 * the raw value and so never feels laggy.
 *
 * The first value passes straight through: there is nothing to wait for yet.
 */
export function useDebouncedValue<T>(value: T, delay = DEBOUNCE_MS): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);

    // Every keystroke cancels the pending commit and starts the wait again, so the
    // value lands once typing pauses rather than once per character.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}
