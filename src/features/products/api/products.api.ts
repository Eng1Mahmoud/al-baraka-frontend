import { apiClient } from "@/shared/lib/apiClient";
import type {
  HomeSection,
  PriceBounds,
  Product,
  ProductFilters,
  ProductListResponse,
} from "@/features/products/types/product";
import type { ProductFormValues } from "@/features/products/schemas/productSchema";

export const productsApi = {
  list: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const { data } = await apiClient.get<ProductListResponse>("/products", { params: filters });
    return data;
  },

  homeSections: async (): Promise<HomeSection[]> => {
    const { data } = await apiClient.get<HomeSection[]>("/products/home");
    return data;
  },

  priceBounds: async (): Promise<PriceBounds> => {
    const { data } = await apiClient.get<PriceBounds>("/products/price-bounds");
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/slug/${slug}`);
    return data;
  },

  create: async (values: ProductFormValues): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/products", values);
    return data;
  },

  update: async (id: string, values: Partial<ProductFormValues>): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, values);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
