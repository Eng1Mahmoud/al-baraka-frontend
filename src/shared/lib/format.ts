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
