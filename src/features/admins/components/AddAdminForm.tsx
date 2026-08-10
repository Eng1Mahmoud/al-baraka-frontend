"use client";

import { AppForm } from "@/shared/components/forms/AppForm";
import { TextField } from "@/shared/components/forms/fields";
import { useCreateAdmin } from "@/features/admins/hooks/useAdmins";
import { adminSchema } from "@/features/admins/schemas/adminSchema";

export function AddAdminForm() {
  const createAdmin = useCreateAdmin();

  return (
    <AppForm
      schema={adminSchema}
      isPending={createAdmin.isPending}
      submitLabel="إضافة المشرف"
      onSubmit={async (values, form) => {
        await createAdmin.mutateAsync(values);
        form.reset();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="الاسم" required />
        <TextField name="email" label="البريد الإلكتروني" type="email" dir="ltr" required />
      </div>

      <TextField
        name="password"
        label="كلمة المرور"
        type="text"
        dir="ltr"
        autoComplete="off"
        hint="بلّغ المشرف بيها ليغيّرها بعد أول دخول"
        required
      />
    </AppForm>
  );
}
