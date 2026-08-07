"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { queryKeys } from "@/shared/lib/queryClient";
import { ordersApi } from "@/features/orders/api/orders.api";
import { useCartStore } from "@/features/cart/store/cartStore";
import type { CheckoutFormValues } from "@/features/orders/schemas/checkoutSchema";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  return useMutation({
    mutationFn: (customer: CheckoutFormValues) =>
      ordersApi.create(
        customer,
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      ),
    // The cart is only emptied once the server has the order — a failed request
    // must leave the customer's basket exactly as it was.
    onSuccess: () => clearCart(),
    onError: (error) => {
      toast.error(getErrorMessage(error));

      // A rejection usually means the shop ran out between the cart being priced
      // and this submit. Re-validating turns a toast that vanishes into a cart that
      // shows which line went, and offers to fix it.
      queryClient.invalidateQueries({ queryKey: queryKeys.cartValidation });
    },
  });
}
