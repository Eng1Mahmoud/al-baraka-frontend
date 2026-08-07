import type { Product } from "@/features/products/types/product";

/**
 * A product is off the menu for either of two reasons — the shop switched it off, or
 * the last of it went — and both read the same to a customer standing in front of it.
 * The card, the product page and the add button all have to agree on the answer, so
 * they ask here instead of each spelling the rule out again.
 */
export const isSoldOut = (product: Pick<Product, "isAvailable" | "stock">) =>
  !product.isAvailable || product.stock === 0;

/** One wording everywhere, so the badge on the card and the button below it match. */
export const SOLD_OUT_LABEL = "غير متاح";
