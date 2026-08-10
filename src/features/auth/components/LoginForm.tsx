"use client";

import { AppForm } from "@/shared/components/forms/AppForm";
import { TextField } from "@/shared/components/forms/fields";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { loginSchema } from "@/features/auth/schemas/loginSchema";

export function LoginForm() {
  const login = useLogin();

  return (
    <AppForm
      schema={loginSchema}
      onSubmit={(values) => login.mutateAsync(values)}
      isPending={login.isPending}
      submitLabel="دخول"
      submitClassName="w-full"
    >
      <TextField
        name="email"
        label="البريد الإلكتروني"
        type="email"
        dir="ltr"
        autoComplete="email"
        required
      />

      <TextField
        name="password"
        label="كلمة المرور"
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
      />
    </AppForm>
  );
}
