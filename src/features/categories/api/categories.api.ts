import { apiClient } from "@/shared/lib/apiClient";
import type { Category } from "@/features/categories/types/category";
import type { CategoryFormValues } from "@/features/categories/schemas/categorySchema";

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },

  create: async (values: CategoryFormValues): Promise<Category> => {
    const { data } = await apiClient.post<Category>("/categories", values);
    return data;
  },

  update: async (id: string, values: Partial<CategoryFormValues>): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categories/${id}`, values);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
