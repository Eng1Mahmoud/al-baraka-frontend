"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseDecimal } from "@/shared/lib/format";
import { AppForm } from "@/shared/components/forms/AppForm";
import {
  ControlledField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
} from "@/shared/components/forms/fields";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { ProductImagesInput } from "@/features/products/components/ProductImagesInput";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/features/products/schemas/productSchema";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormInput>;
  onSubmit: (values: ProductFormValues) => Promise<unknown>;
  submitLabel: string;
}

export function ProductForm({ defaultValues, onSubmit, submitLabel }: ProductFormProps) {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: settings } = useSettings();
  const units = settings?.units ?? [];

  // A product can't exist without a category, so say that plainly instead of
  // leaving an empty dropdown that looks broken.
  if (!isLoadingCategories && categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-brand-50 p-8 text-center">
        <p className="mb-1 font-semibold text-brand-900">أضف تصنيف الأول</p>
        <p className="mb-5 text-sm text-muted-foreground">
          كل منتج لازم يكون تحت تصنيف، وما فيش تصنيفات مضافة لحد دلوقتي.
        </p>
        <Button asChild>
          <Link href="/dashboard/categories">
            <Plus className="size-4" aria-hidden />
            إضافة تصنيف
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <AppForm
      schema={productSchema}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      className="space-y-6"
      defaultValues={{
        name: "",
        description: "",
        category: "",
        unit: "",
        stock: 0,
        images: [],
        isAvailable: true,
        ...defaultValues,
      }}
    >
      <TextField name="name" label="اسم المنتج" placeholder="طماطم بلدي" required />

      <SelectField
        name="category"
        label="التصنيف"
        required
        disabled={isLoadingCategories}
        placeholder={isLoadingCategories ? "بنحمّل التصنيفات..." : "اختر التصنيف"}
        options={categories.map((category) => ({ value: category._id, label: category.name }))}
      />

      {/* Price and unit sit together because a price only means something with its unit. */}
      <fieldset className="rounded-xl border bg-brand-50 p-4">
        <legend className="px-2 text-sm font-semibold text-brand-900">السعر والوحدة</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            name="price"
            label="السعر"
            type="text"
            inputMode="decimal"
            placeholder="18.5"
            hint="بالجنيه، والكسور مسموحة — مثال: 12.5"
            required
            // Normalises Arabic-Indic digits and the ٫ separator before zod sees it.
            registerOptions={{ setValueAs: parseDecimal }}
          />

          <SelectField
            name="unit"
            label="الوحدة"
            required
            placeholder="كجم"
            hint={units.length ? "تُدار قائمة الوحدات من الإعدادات" : "أضف وحدات البيع من صفحة الإعدادات"}
            options={units.map((unit) => ({ value: unit, label: unit }))}
          />

          <TextField
            name="discountPrice"
            label="سعر بعد الخصم"
            type="text"
            inputMode="decimal"
            placeholder="15.75"
            hint="اتركه فارغًا لو مفيش خصم"
            registerOptions={{ setValueAs: parseDecimal }}
          />
        </div>
      </fieldset>

      <TextField name="stock" label="الكمية المتاحة" type="number" min="0" />

      <TextareaField
        name="description"
        label="الوصف"
        rows={3}
        placeholder="طماطم بلدي طازجة، مناسبة للطبخ والسلطة."
      />

      {/* No label — ProductImagesInput draws its own. */}
      <ControlledField
        name="images"
        render={(field) => (
          <ProductImagesInput value={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <SwitchField name="isAvailable" label="متاح للبيع الآن" />
    </AppForm>
  );
}
