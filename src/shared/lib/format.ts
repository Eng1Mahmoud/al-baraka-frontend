const currencyFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatPrice = (value: number) => currencyFormatter.format(value);

/** Price always travels with its unit: "18 ج.م / كجم". */
export const formatPricePerUnit = (value: number, unit: string) =>
  `${currencyFormatter.format(value)} / ${unit}`;

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));

const ARABIC_INDIC_DIGITS = /[٠-٩۰-۹]/g;

/**
 * Reads a number the way it was actually typed.
 *
 * The dashboard is used on Arabic keyboards, which produce Arabic-Indic digits and
 * "٫" or "،" where a Latin keyboard produces "12.5" — and `<input type="number">`
 * silently hands back an empty string for all of those, so a price typed in Arabic
 * looks to the form like no price at all. Everything is normalised to Latin digits
 * with a single decimal point before it reaches Zod.
 *
 * Separators follow Unicode: "٫" (Arabic decimal) and "،" (the comma key people
 * reach for) mark the fraction; "," and "٬" are thousands and are dropped.
 *
 * Returns `undefined` for blank or unreadable input so optional fields stay optional
 * instead of collapsing to 0.
 */
export const parseDecimal = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;

  const normalized = value
    .replace(ARABIC_INDIC_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))
    .replace(/[٫،]/g, ".")
    .replace(/[,٬\s]/g, "");

  if (!normalized) return undefined;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};
