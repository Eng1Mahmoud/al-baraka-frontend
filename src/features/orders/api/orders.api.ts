import { apiClient } from "@/shared/lib/apiClient";
import type {
  Order,
  OrderAnalytics,
  OrderListResponse,
  OrderStats,
  OrderStatus,
  PaymentStatus,
  TrackedOrder,
} from "@/features/orders/types/order";
import type { CheckoutFormValues } from "@/features/orders/schemas/checkoutSchema";

export interface OrderFilters {
  status?: OrderStatus;
  /** Matched against the order number, the customer's name, and their phone. */
  search?: string;
  page?: number;
  limit?: number;
}

export const ordersApi = {
  create: async (
    values: CheckoutFormValues,
    items: { productId: string; quantity: number }[]
  ): Promise<Order> => {
    const { deliveryAreaId, ...customer } = values;
    const { data } = await apiClient.post<Order>("/orders", { customer, items, deliveryAreaId });
    return data;
  },

  track: async (orderNumber: string): Promise<TrackedOrder> => {
    const { data } = await apiClient.get<TrackedOrder>("/orders/track", { params: { orderNumber } });
    return data;
  },

  list: async (filters: OrderFilters = {}): Promise<OrderListResponse> => {
    const { data } = await apiClient.get<OrderListResponse>("/orders", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  stats: async (): Promise<OrderStats> => {
    const { data } = await apiClient.get<OrderStats>("/orders/stats");
    return data;
  },

  analytics: async (days: number): Promise<OrderAnalytics> => {
    const { data } = await apiClient.get<OrderAnalytics>("/orders/analytics", { params: { days } });
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/payment`, { paymentStatus });
    return data;
  },
};
