"use client";

import { AppForm } from "@/shared/components/forms/AppForm";
import { ControlledField, TextField } from "@/shared/components/forms/fields";
import { ImageUploadInput } from "@/shared/components/forms/ImageUploadInput";
import {
  categorySchema,
  type CategoryFormInput,
  type CategoryFormValues,
} from "@/features/categories/schemas/categorySchema";

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormInput>;
  onSubmit: (values: CategoryFormValues) => Promise<unknown>;
  submitLabel: string;
  /** Clears the fields after a successful submit — wanted when adding, not when editing. */
  resetOnSuccess?: boolean;
}

const EMPTY: CategoryFormInput = { name: "", image: "", order: 0 };

export function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel,
  resetOnSuccess = false,
}: CategoryFormProps) {
  return (
    <AppForm
      schema={categorySchema}
      submitLabel={submitLabel}
      className="space-y-5"
      defaultValues={{ ...EMPTY, ...defaultValues }}
      onSubmit={async (values, form) => {
        await onSubmit(values);
        if (resetOnSuccess) form.reset(EMPTY);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <TextField name="name" label="اسم القسم" placeholder="خضروات" required />
        <TextField name="order" label="ترتيب العرض" type="number" min="0" hint="الأقل يظهر أولًا" />
      </div>

      <ControlledField
        name="image"
        label="صورة القسم"
        render={(field) => (
          <ImageUploadInput
            value={field.value || undefined}
            // Normalised back to "" because the schema accepts a URL or an empty
            // string, never undefined.
            onChange={(url) => field.onChange(url ?? "")}
            shape="wide"
          />
        )}
      />
    </AppForm>
  );
}
