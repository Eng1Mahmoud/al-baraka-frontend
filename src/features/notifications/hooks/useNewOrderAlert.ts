"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice } from "@/shared/lib/format";
import type { Order } from "@/features/orders/types/order";

/**
 * Keeps the dashboard in step with new orders.
 *
 * The alert itself is the system notification raised by the service worker — one
 * mechanism and one sound whether the tab is focused, buried behind others, or
 * closed entirely. This hook covers only what a notification can't: refreshing the
 * list on screen the moment a push lands, and putting the order one click away for
 * an admin who is already looking at it.
 */
export function useNewOrderAlert(latestOrder?: Order) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const lastSeenRef = useRef<string | undefined>(undefined);

  // The push arrives in the worker, which forwards it here, so the list updates the
  // instant the order lands instead of waiting for the next poll.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "new-order") return;
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [queryClient]);

  useEffect(() => {
    if (!latestOrder) return;

    // The first pass after mount records the baseline — existing orders aren't new.
    if (lastSeenRef.current === undefined) {
      lastSeenRef.current = latestOrder._id;
      return;
    }

    if (lastSeenRef.current === latestOrder._id) return;
    lastSeenRef.current = latestOrder._id;

    toast(`طلب جديد · ${latestOrder.customer.name}`, {
      // Keyed by order, so the same order can never stack up two cards.
      id: `new-order-${latestOrder._id}`,
      description: `${latestOrder.orderNumber} · ${formatPrice(latestOrder.total)}`,
      // Someone just told an order arrived is going to reach for it. Sonner closes
      // the toast itself once the action runs.
      action: {
        label: "افتح الطلب",
        onClick: () => router.push(`/dashboard/orders/${latestOrder._id}`),
      },
      // It can land while nobody is at the screen; the default few seconds would
      // routinely miss its reader.
      duration: 20_000,
    });
  }, [latestOrder, router]);
}
