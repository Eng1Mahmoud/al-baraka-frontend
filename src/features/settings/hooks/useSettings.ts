"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { settingsApi } from "@/features/settings/api/settings.api";
import type { StoreSettings } from "@/features/settings/types/settings";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<StoreSettings>) => settingsApi.update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      toast.success("تم حفظ الإعدادات");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
