import { z } from "zod";

export const settingsSchema = z.object({
  storeName: z.string().min(2, "اسم المتجر مطلوب"),
  storePhone: z
    .string()
    .regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح، مثال: 01012345678")
    .or(z.literal("")),
  workingHours: z.string().max(60, "النص طويل").optional(),
});

export type SettingsFormInput = z.input<typeof settingsSchema>;
export type SettingsFormValues = z.output<typeof settingsSchema>;
