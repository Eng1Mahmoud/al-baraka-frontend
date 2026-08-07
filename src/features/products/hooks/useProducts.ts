"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { productsApi } from "@/features/products/api/products.api";
import type { ProductFilters } from "@/features/products/types/product";
import type { ProductFormValues } from "@/features/products/schemas/productSchema";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productsApi.list(filters),
  });
}

/** Paged list for the all-products page — one page appended per scroll. */
export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products({ ...filters, infinite: true }),
    queryFn: ({ pageParam }) => productsApi.list({ ...filters, page: pageParam, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

export function useHomeSections() {
  return useQuery({
    queryKey: ["products", "home"],
    queryFn: productsApi.homeSections,
  });
}

export function usePriceBounds() {
  return useQuery({
    queryKey: ["products", "price-bounds"],
    queryFn: productsApi.priceBounds,
    staleTime: 10 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductFormValues) => productsApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تمت إضافة المنتج");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<ProductFormValues>) => productsApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
      toast.success("تم حفظ التغييرات");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم حذف المنتج");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
