import type { Product } from "@/features/products/types/product";

export const isSoldOut = (product: Pick<Product, "isAvailable" | "stock">) =>
  !product.isAvailable || product.stock === 0;

/** One wording everywhere, so the badge on the card and the button below it match. */
export const SOLD_OUT_LABEL = "غير متاح";
