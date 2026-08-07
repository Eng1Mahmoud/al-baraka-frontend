"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
import { useCreateAdmin } from "@/features/admins/hooks/useAdmins";
import { adminSchema, type AdminFormValues } from "@/features/admins/schemas/adminSchema";

export function AddAdminForm() {
  const createAdmin = useCreateAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({ resolver: zodResolver(adminSchema) });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await createAdmin.mutateAsync(values);
        reset();
      })}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="الاسم" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" {...register("name")} />
        </FormField>

        <FormField label="البريد الإلكتروني" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" dir="ltr" {...register("email")} />
        </FormField>
      </div>

      <FormField
        label="كلمة المرور"
        htmlFor="password"
        error={errors.password?.message}
        hint="بلّغ المشرف بيها ليغيّرها بعد أول دخول"
        required
      >
        <Input id="password" type="text" dir="ltr" autoComplete="off" {...register("password")} />
      </FormField>

      <SubmitButton isSubmitting={isSubmitting || createAdmin.isPending}>إضافة المشرف</SubmitButton>
    </form>
  );
}
