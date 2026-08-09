import { z } from "zod";

const baseFields = {
  name: z.string().min(3, "الاسم مطلوب"),
  phone: z.string().regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح، مثال: 01012345678"),
  address: z.string().min(10, "اكتب العنوان بالتفصيل (الشارع، رقم العقار، الدور)"),
  notes: z.string().max(200, "الملاحظات طويلة جدًا").optional(),
};

export const createCheckoutSchema = (requiresArea: boolean) =>
  z.object({
    ...baseFields,
    deliveryAreaId: requiresArea
      ? z.string().min(1, "اختر منطقة التوصيل")
      : z.string().optional(),
  });

export const checkoutSchema = createCheckoutSchema(false);

export type CheckoutFormValues = z.infer<typeof checkoutSchema> & { deliveryAreaId?: string };
