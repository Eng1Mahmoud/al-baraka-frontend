"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
import { useSettings, useUpdateSettings } from "@/features/settings/hooks/useSettings";
import {
  settingsSchema,
  type SettingsFormInput,
  type SettingsFormValues,
} from "@/features/settings/schemas/settingsSchema";

export function StoreSettingsForm() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormInput, unknown, SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: settings && {
      storeName: settings.storeName,
      storePhone: settings.storePhone,
      workingHours: settings.workingHours,
    },
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <form
      onSubmit={handleSubmit((values) => updateSettings.mutateAsync(values))}
      className="space-y-5"
    >
      <FormField label="اسم المتجر" htmlFor="storeName" error={errors.storeName?.message} required>
        <Input id="storeName" {...register("storeName")} />
      </FormField>

      <FormField
        label="رقم الهاتف"
        htmlFor="storePhone"
        error={errors.storePhone?.message}
        hint="بيظهر للعملاء في الفوتر وصفحة من نحن"
      >
        <Input id="storePhone" dir="ltr" inputMode="tel" placeholder="01012345678" {...register("storePhone")} />
      </FormField>

      <FormField
        label="مواعيد العمل"
        htmlFor="workingHours"
        error={errors.workingHours?.message}
        hint="مثال: يوميًا من 9 ص إلى 11 م"
      >
        <Input id="workingHours" {...register("workingHours")} />
      </FormField>

      <SubmitButton isSubmitting={isSubmitting || updateSettings.isPending}>حفظ الإعدادات</SubmitButton>
    </form>
  );
}
