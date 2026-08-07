"use client";

import { useSyncExternalStore } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/queryClient";
import { cartApi } from "@/features/cart/api/cart.api";
import { useCartStore } from "@/features/cart/store/cartStore";

const subscribeToNothing = () => () => {};

/**
 * Zustand rehydrates from localStorage after the first paint, so anything reading
 * the cart during render must wait — otherwise the server HTML and the client's
 * first render disagree and React throws a hydration error.
 */
export function useCartHydrated() {
  // Returns false during SSR and the first client render, true afterwards —
  // the server and client snapshots differing is exactly the signal we want.
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

/**
 * How many products are in the cart — not how much of them.
 *
 * Most of the catalogue is sold by weight, so summing quantities would put "12" on
 * the badge for a single order of tomatoes. The number of lines is the one that
 * means something to someone glancing at the header.
 */
export function useCartCount() {
  const items = useCartStore((state) => state.items);
  const isHydrated = useCartHydrated();

  return isHydrated ? items.length : 0;
}

/**
 * The cart page's source of truth: totals and stock come from the server.
 * Passing a delivery area re-prices the delivery line for that area.
 */
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
