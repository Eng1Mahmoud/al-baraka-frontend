"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { deliveryAreasApi, type DeliveryAreaInput } from "@/features/delivery-areas/api/deliveryAreas.api";

const AREAS_KEY = ["delivery-areas"];

export function useDeliveryAreas(activeOnly = false) {
  return useQuery({
    queryKey: [...AREAS_KEY, { activeOnly }],
    queryFn: () => deliveryAreasApi.list(activeOnly),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: DeliveryAreaInput) => deliveryAreasApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_KEY });
      toast.success("تمت إضافة المنطقة");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<DeliveryAreaInput> }) =>
      deliveryAreasApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_KEY });
      toast.success("تم حفظ التغييرات");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryAreasApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_KEY });
      toast.success("تم حذف المنطقة");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
