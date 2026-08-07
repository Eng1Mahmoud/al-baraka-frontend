"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { ordersApi, type OrderFilters } from "@/features/orders/api/orders.api";
import type { OrderStatus, PaymentStatus } from "@/features/orders/types/order";

/** Dashboard order list. Polls every 5s, including while the tab is in the background. */
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => ordersApi.list(filters),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
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
