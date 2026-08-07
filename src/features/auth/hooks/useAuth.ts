"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/queryClient";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { authApi } from "@/features/auth/api/auth.api";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hands the session to this app's own domain, where `proxy.ts` can see it.
 *
 * Not `apiClient` — that is pointed at the API, and `/api/session` is a route of this app.
 * Awaited before the redirect: unawaited, the gate on /dashboard runs before the cookie
 * it looks for has been written, and sends the login it just approved back to /login.
 */
const startSession = (token: string) =>
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

const endSession = () => fetch("/api/session", { method: "DELETE" });

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: async ({ user, token }) => {
      queryClient.setQueryData(queryKeys.me, user);
      await startSession(token);
      router.replace("/dashboard");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await endSession();
      queryClient.clear();
      router.replace("/login");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
