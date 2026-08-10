"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { ordersApi, type OrderFilters } from "@/features/orders/api/orders.api";
import type { OrderStatus, PaymentStatus } from "@/features/orders/types/order";

/** Polling shared by both order lists: a shop watches this screen for work arriving. */
const LIVE = {
  refetchInterval: 5000,
  refetchIntervalInBackground: true,
  staleTime: 0,
} as const;

/**
 * First page only — the header's pending counter and the new-order alert, which need
 * the newest orders and nothing else.
 */
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => ordersApi.list(filters),
    ...LIVE,
  });
}

/**
 * The dashboard table — pages appended as the operator scrolls.
 *
 * Kept polling like the counter above, because this is the screen a shop actually
 * watches. The cost is that every loaded page is refetched on each tick, so scrolling
 * deep makes the poll heavier; at a grocery's order volume that stays cheap.
 *
 * Paging is by offset, so orders arriving mid-session shift rows between pages and the
 * same order can come back twice — deduplicate on `_id` when flattening.
 */
export function useInfiniteOrders(filters: OrderFilters = {}, limit = 20) {
  return useInfiniteQuery({
    queryKey: queryKeys.orders({ ...filters, limit, infinite: true }),
    queryFn: ({ pageParam }) => ordersApi.list({ ...filters, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    ...LIVE,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: queryKeys.orderStats,
    queryFn: ordersApi.stats,
    refetchInterval: 30_000,
  });
}

/**
 * The chart data. `placeholderData` keeps the previous window on screen while a new
 * range loads, so changing the date filter re-renders the charts in place instead of
 * dropping them for a skeleton and jumping the page.
 */
export function useOrderAnalytics(days: number) {
  return useQuery({
    queryKey: [...queryKeys.orderAnalytics, days],
    queryFn: () => ordersApi.analytics(days),
    placeholderData: (previous) => previous,
    refetchInterval: 60_000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(queryKeys.order(order._id), order);
      toast.success("تم تحديث حالة الطلب");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) =>
      ordersApi.updatePaymentStatus(id, paymentStatus),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(queryKeys.order(order._id), order);
      toast.success("تم تحديث حالة الدفع");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
