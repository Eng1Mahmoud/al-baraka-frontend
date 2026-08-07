import { apiClient } from "@/shared/lib/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";

export const authApi = {
  login: async (values: LoginFormValues): Promise<AuthUser> => {
    const { data } = await apiClient.post<{ user: AuthUser }>("/auth/login", values);
    return data.user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>("/auth/me");
    return data;
  },
};
