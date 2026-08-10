import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});

export type AdminFormValues = z.infer<typeof adminSchema>;
