import { apiClient } from "@/shared/lib/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";
import type { AdminFormValues } from "@/features/admins/schemas/adminSchema";

export interface AdminAccount extends AuthUser {
  _id: string;
  createdAt: string;
}

export const adminsApi = {
  list: async (): Promise<AdminAccount[]> => {
    const { data } = await apiClient.get<AdminAccount[]>("/admins");
    return data;
  },

  create: async (values: AdminFormValues): Promise<AdminAccount> => {
    const { data } = await apiClient.post<AdminAccount>("/admins", values);
    return data;
  },

  update: async (id: string, values: { name?: string; email?: string }): Promise<AdminAccount> => {
    const { data } = await apiClient.patch<AdminAccount>(`/admins/${id}`, values);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/admins/${id}`);
  },
};
