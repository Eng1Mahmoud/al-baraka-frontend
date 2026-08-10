"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AppForm } from "@/shared/components/forms/AppForm";
import { TextField } from "@/shared/components/forms/fields";
import { useSettings, useUpdateSettings } from "@/features/settings/hooks/useSettings";
import { settingsSchema } from "@/features/settings/schemas/settingsSchema";

export function StoreSettingsForm() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <AppForm
      schema={settingsSchema}
      onSubmit={(values) => updateSettings.mutateAsync(values)}
      isPending={updateSettings.isPending}
      submitLabel="حفظ الإعدادات"
      className="space-y-5"
      // `values`, not `defaultValues`: these come from the server, and this keeps the
      // fields in step with a refetch instead of freezing whatever arrived first.
      values={
        settings && {
          storeName: settings.storeName,
          storePhone: settings.storePhone,
          workingHours: settings.workingHours,
        }
      }
    >
      <TextField name="storeName" label="اسم المتجر" required />

      <TextField
        name="storePhone"
        label="رقم الهاتف"
        dir="ltr"
        inputMode="tel"
        placeholder="01012345678"
        hint="بيظهر للعملاء في الفوتر وصفحة من نحن"
      />

      <TextField
        name="workingHours"
        label="مواعيد العمل"
        hint="مثال: يوميًا من 9 ص إلى 11 م"
      />
    </AppForm>
  );
}
