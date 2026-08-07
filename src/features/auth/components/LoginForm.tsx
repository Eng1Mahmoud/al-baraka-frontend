"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/loginSchema";

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit((values) => login.mutateAsync(values))} className="space-y-4">
      <FormField label="البريد الإلكتروني" htmlFor="email" error={errors.email?.message} required>
        <Input id="email" type="email" dir="ltr" autoComplete="email" {...register("email")} />
      </FormField>

      <FormField label="كلمة المرور" htmlFor="password" error={errors.password?.message} required>
        <Input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      <SubmitButton isSubmitting={isSubmitting || login.isPending} className="w-full">
        دخول
      </SubmitButton>
    </form>
  );
}
