"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { categoriesApi } from "@/features/categories/api/categories.api";
import type { CategoryFormValues } from "@/features/categories/schemas/categorySchema";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CategoryFormValues) => categoriesApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success("تمت إضافة التصنيف");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<CategoryFormValues>) => categoriesApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success("تم حفظ التغييرات");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success("تم حذف التصنيف");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
