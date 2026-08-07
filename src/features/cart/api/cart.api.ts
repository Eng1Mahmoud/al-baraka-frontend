import { apiClient } from "@/shared/lib/apiClient";
import type { ValidatedCart } from "@/features/cart/types/cart";

export const cartApi = {
  /** Sends the local cart to the server and gets back current prices and totals. */
  validate: async (
    items: { productId: string; quantity: number }[],
    deliveryAreaId?: string
  ): Promise<ValidatedCart> => {
    const { data } = await apiClient.post<ValidatedCart>("/cart/validate", {
      items,
      deliveryAreaId,
    });
    return data;
  },
};
