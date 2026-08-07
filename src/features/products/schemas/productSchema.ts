import { z } from "zod";

/**
 * EGP has piastres and nothing smaller, so two decimals is the real limit. Without
 * this a price of 1.234 would be stored in full but displayed — and read by the
 * customer — as 1.23. Compared on integer piastres to stay clear of float error.
 */
const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

const TWO_DECIMALS_MESSAGE = "السعر يقبل رقمين عشريين على الأكثر (مثال: 12.5)";

/**
 * Price and unit are one idea, not two fields: a product is always "X per unit".
 * The unit list itself comes from Settings so the shop owner can add units without
 * a code change.
 *
 * Prices are decimal — produce is priced in halves and quarters of a pound as often
 * as in whole ones. The form normalises what was typed (see `parseDecimal`) before
 * these rules run.
 */
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
