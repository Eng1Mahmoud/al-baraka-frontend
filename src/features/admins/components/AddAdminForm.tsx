"use client";

import { AppForm } from "@/shared/components/forms/AppForm";
import { PasswordField, TextField } from "@/shared/components/forms/fields";
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

      {/* Visible by default: this password is being written down to hand over, not
          typed in secret, so hiding it would only invite a typo nobody can check. */}
      <PasswordField
        name="password"
        label="كلمة المرور"
        autoComplete="off"
        hint="بلّغ المشرف بيها ليغيّرها بعد أول دخول"
        defaultVisible
        required
      />
    </AppForm>
  );
}
