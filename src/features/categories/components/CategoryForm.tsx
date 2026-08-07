"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
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

export function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel,
  resetOnSuccess = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", image: "", order: 0, ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        if (resetOnSuccess) reset({ name: "", image: "", order: 0 });
      })}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <FormField label="اسم القسم" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" placeholder="خضروات" {...register("name")} />
        </FormField>

        <FormField
          label="ترتيب العرض"
          htmlFor="order"
          error={errors.order?.message}
          hint="الأقل يظهر أولًا"
        >
          <Input id="order" type="number" min="0" {...register("order")} />
        </FormField>
      </div>

      <FormField label="صورة القسم" htmlFor="image" error={errors.image?.message}>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUploadInput
              value={field.value || undefined}
              onChange={(url) => field.onChange(url ?? "")}
              shape="wide"
            />
          )}
        />
      </FormField>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
}
