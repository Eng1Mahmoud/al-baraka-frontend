import { apiClient } from "@/shared/lib/apiClient";
import type { StoreSettings } from "@/features/settings/types/settings";

export const settingsApi = {
  get: async (): Promise<StoreSettings> => {
    const { data } = await apiClient.get<StoreSettings>("/settings");
    return data;
  },

  update: async (values: Partial<StoreSettings>): Promise<StoreSettings> => {
    const { data } = await apiClient.patch<StoreSettings>("/settings", values);
    return data;
  },
};
