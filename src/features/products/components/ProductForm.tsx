"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
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

/**
 * Availability follows stock, matching what the API enforces on save: a product with
 * nothing on the shelf cannot be on sale, so the switch goes off and locks.
 *
 * Restocking unlocks it but does not switch it back on — the server behaves the same
 * way, because it cannot tell a sold-out product from one hidden on purpose.
 */
function AvailabilitySwitch() {
  const { control, setValue } = useFormContext();
  const stock = useWatch({ control, name: "stock" });

  // An empty box is someone mid-edit, not a zero — only a written 0 counts, or the
  // switch would flip off in the moment between clearing the field and retyping it.
  const isOutOfStock = stock !== "" && stock != null && Number(stock) === 0;

  useEffect(() => {
    if (isOutOfStock) setValue("isAvailable", false);
  }, [isOutOfStock, setValue]);

  return (
    <SwitchField
      name="isAvailable"
      label="متاح للبيع الآن"
      disabled={isOutOfStock}
      hint={isOutOfStock ? "الكمية صفر، فالمنتج مش هيظهر للعملاء. زوّد الكمية الأول." : undefined}
    />
  );
}

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

      <AvailabilitySwitch />
    </AppForm>
  );
}
