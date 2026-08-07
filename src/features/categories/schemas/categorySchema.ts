import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "اسم التصنيف مطلوب"),
  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
  order: z.coerce.number().int().min(0, "الترتيب لا يقل عن صفر").default(0),
});

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormValues = z.output<typeof categorySchema>;
