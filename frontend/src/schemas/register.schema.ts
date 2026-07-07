import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(11, 'رقم الهاتف غير صحيح').max(11, 'رقم الهاتف غير صحيح'),
  email: z.email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
