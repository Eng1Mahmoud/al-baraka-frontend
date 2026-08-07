import { apiClient } from "@/shared/lib/apiClient";
import type {
  Order,
  OrderListResponse,
  OrderStats,
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order";
import type { CheckoutFormValues } from "@/features/orders/schemas/checkoutSchema";

export interface OrderFilters {
  status?: OrderStatus;
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

  track: async (orderNumber: string, phone: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>("/orders/track", { params: { orderNumber, phone } });
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

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/payment`, { paymentStatus });
    return data;
  },
};
