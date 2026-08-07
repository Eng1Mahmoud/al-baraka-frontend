/** A cart line as the server sees it, with fresh price, stock and availability. */
export interface ValidatedCartItem {
  productId: string;
  name?: string;
  slug?: string;
  image?: string | null;
  unit?: string;
  price?: number;
  originalPrice?: number | null;
  stock?: number;
  isAvailable?: boolean;
  quantity: number;
  lineTotal?: number;
  /** True when the product no longer exists at all. */
  removed: boolean;
  /** Arabic explanation when the line can't be ordered as-is. */
  issue?: string | null;
}

export interface ValidatedCart {
  items: ValidatedCartItem[];
  subtotal: number;
  /** Zero until a delivery area is chosen — delivery is priced per area. */
  deliveryFee: number;
  total: number;
  /** True when the shop has delivery areas, so one must be chosen to check out. */
  requiresArea: boolean;
  selectedArea: { _id: string; name: string; price: number } | null;
  canCheckout: boolean;
}
