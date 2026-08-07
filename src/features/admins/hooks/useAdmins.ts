"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { adminsApi } from "@/features/admins/api/admins.api";
import type { AdminFormValues } from "@/features/admins/schemas/adminSchema";

export function useAdmins() {
  return useQuery({
    queryKey: queryKeys.admins,
    queryFn: adminsApi.list,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AdminFormValues) => adminsApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast.success("تمت إضافة المشرف");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast.success("تم حذف الحساب");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
