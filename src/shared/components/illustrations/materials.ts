/**
 * Materials the illustrations are drawn from.
 *
 * Produce, leaves and greens always use the brand and fruit tokens so the drawings
 * can never drift from the palette. Wood and brass have no token because nothing in
 * the UI is ever painted with them — they exist only inside the market scenes, so
 * they live here instead of widening `@theme` with colors no component can use.
 */
export const WOOD = {
  light: "#E0B478",
  mid: "#C99A5B",
  dark: "#A87B41",
} as const;

/** The scale — an old brass balance, the one instrument every greengrocer has. */
export const BRASS = {
  mid: "#C08A2E",
  dark: "#8F6416",
} as const;
