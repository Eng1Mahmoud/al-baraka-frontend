"use client";

import { useSyncExternalStore } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/queryClient";
import { cartApi } from "@/features/cart/api/cart.api";
import { useCartStore } from "@/features/cart/store/cartStore";

const subscribeToNothing = () => () => {};

export function useCartHydrated() {
  // Returns false during SSR and the first client render, true afterwards —
  // the server and client snapshots differing is exactly the signal we want.
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

export function useCartCount() {
  const items = useCartStore((state) => state.items);
  const isHydrated = useCartHydrated();

  return isHydrated ? items.length : 0;
}

export function useValidatedCart(deliveryAreaId?: string) {
  const items = useCartStore((state) => state.items);
  const isHydrated = useCartHydrated();

  const lines = items.map((item) => ({ productId: item.productId, quantity: item.quantity }));

  return useQuery({
    queryKey: [...queryKeys.cartValidation, lines, deliveryAreaId ?? null],
    queryFn: () => cartApi.validate(lines, deliveryAreaId),
    enabled: isHydrated && lines.length > 0,
    staleTime: 0,
    // The quantities are part of the key, so every "+" is a different query with an
    // empty cache. Without this the cart would drop to a loading state — and the
    // page to a skeleton — each time someone changed a number. Holding the previous
    // result keeps the cart on screen while the new totals come back.
    placeholderData: keepPreviousData,
  });
}
