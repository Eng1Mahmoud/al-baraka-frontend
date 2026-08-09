import { z } from "zod";

const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

const TWO_DECIMALS_MESSAGE = "السعر يقبل رقمين عشريين على الأكثر (مثال: 12.5)";

export const productSchema = z
  .object({
    name: z.string().min(2, "اسم المنتج مطلوب"),
    description: z.string().max(500, "الوصف طويل جدًا").optional(),
    category: z.string().min(1, "اختر التصنيف"),
    price: z.coerce
      .number({ error: "أدخل سعرًا صحيحًا" })
      .positive("السعر يجب أن يكون أكبر من صفر")
      .refine(hasAtMostTwoDecimals, TWO_DECIMALS_MESSAGE),
    unit: z.string().min(1, "اختر الوحدة"),
    discountPrice: z.coerce
      .number({ error: "أدخل سعرًا صحيحًا" })
      .positive("سعر الخصم يجب أن يكون أكبر من صفر")
      .refine(hasAtMostTwoDecimals, TWO_DECIMALS_MESSAGE)
      .optional(),
    stock: z.coerce.number().min(0, "الكمية لا تقل عن صفر").default(0),
    images: z.array(z.string().url()).default([]),
    isAvailable: z.boolean().default(true),
  })
  .refine((data) => data.discountPrice == null || data.discountPrice < data.price, {
    message: "سعر الخصم يجب أن يكون أقل من السعر الأساسي",
    path: ["discountPrice"],
  });

/** What the inputs hold before Zod coerces them (strings from number fields). */
export type ProductFormInput = z.input<typeof productSchema>;
/** What the form hands to the API after validation. */
export type ProductFormValues = z.output<typeof productSchema>;
