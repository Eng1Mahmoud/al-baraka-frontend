"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseDecimal } from "@/shared/lib/format";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
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
  const hasNoCategories = !isLoadingCategories && categories.length === 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      unit: "",
      stock: 0,
      images: [],
      isAvailable: true,
      ...defaultValues,
    },
  });

  if (hasNoCategories) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="اسم المنتج" htmlFor="name" error={errors.name?.message} required>
        <Input id="name" placeholder="طماطم بلدي" {...register("name")} />
      </FormField>

      <FormField label="التصنيف" htmlFor="category" error={errors.category?.message} required>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingCategories}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder={isLoadingCategories ? "بنحمّل التصنيفات..." : "اختر التصنيف"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {/* Price and unit sit together because a price only means something with its unit. */}
      <fieldset className="rounded-xl border bg-brand-50 p-4">
        <legend className="px-2 text-sm font-semibold text-brand-900">السعر والوحدة</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Not `type="number"`: it refuses Arabic-Indic digits and the "٫" key,
              which is what an Arabic keyboard produces. `inputMode="decimal"` still
              opens the numeric keypad on a phone, and parseDecimal reads either. */}
          <FormField
            label="السعر"
            htmlFor="price"
            error={errors.price?.message}
            hint="بالجنيه، والكسور مسموحة — مثال: 12.5"
            required
          >
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              placeholder="18.5"
              {...register("price", { setValueAs: parseDecimal })}
            />
          </FormField>

          <FormField
            label="الوحدة"
            htmlFor="unit"
            error={errors.unit?.message}
            hint={units.length ? "تُدار قائمة الوحدات من الإعدادات" : "أضف وحدات البيع من صفحة الإعدادات"}
            required
          >
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue placeholder="كجم" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="سعر بعد الخصم"
            htmlFor="discountPrice"
            error={errors.discountPrice?.message}
            hint="اتركه فارغًا لو مفيش خصم"
          >
            <Input
              id="discountPrice"
              type="text"
              inputMode="decimal"
              placeholder="15.75"
              {...register("discountPrice", { setValueAs: parseDecimal })}
            />
          </FormField>
        </div>
      </fieldset>

      <FormField label="الكمية المتاحة" htmlFor="stock" error={errors.stock?.message}>
        <Input id="stock" type="number" min="0" {...register("stock")} />
      </FormField>

      <FormField label="الوصف" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={3} placeholder="طماطم بلدي طازجة، مناسبة للطبخ والسلطة." {...register("description")} />
      </FormField>

      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <ProductImagesInput value={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name="isAvailable"
          render={({ field }) => (
            <Switch id="isAvailable" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="isAvailable">متاح للبيع الآن</Label>
      </div>

      <SubmitButton isSubmitting={isSubmitting}>{submitLabel}</SubmitButton>
    </form>
  );
}
