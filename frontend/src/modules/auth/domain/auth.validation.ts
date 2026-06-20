import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const securePasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial (ej. !@#$%^&*)');

export const registerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
  password: securePasswordSchema,
  confirmPassword: z.string().min(1, 'Debe confirmar su contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
