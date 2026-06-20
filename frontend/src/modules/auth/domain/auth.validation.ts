import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const registerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Debe confirmar su contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
