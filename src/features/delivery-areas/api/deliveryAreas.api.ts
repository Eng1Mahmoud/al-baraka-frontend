import { apiClient } from "@/shared/lib/apiClient";
import type { DeliveryArea } from "@/features/delivery-areas/types/deliveryArea";

export interface DeliveryAreaInput {
  name: string;
  price: number;
  isActive?: boolean;
  order?: number;
}

export const deliveryAreasApi = {
  /** `activeOnly` for the storefront; the dashboard lists hidden areas too. */
  list: async (activeOnly = false): Promise<DeliveryArea[]> => {
    const { data } = await apiClient.get<DeliveryArea[]>("/delivery-areas", {
      params: activeOnly ? { activeOnly: true } : undefined,
    });
    return data;
  },

  create: async (values: DeliveryAreaInput): Promise<DeliveryArea> => {
    const { data } = await apiClient.post<DeliveryArea>("/delivery-areas", values);
    return data;
  },

  update: async (id: string, values: Partial<DeliveryAreaInput>): Promise<DeliveryArea> => {
    const { data } = await apiClient.patch<DeliveryArea>(`/delivery-areas/${id}`, values);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/delivery-areas/${id}`);
  },
};
