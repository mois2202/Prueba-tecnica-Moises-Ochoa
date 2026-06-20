import { z } from 'zod';

export const projectSchema = z.object({
  nombre: z.string().min(1, 'El nombre del proyecto es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fechaLimite: z.string().min(1, 'La fecha límite es obligatoria'),
});

export type ProjectFormInput = z.infer<typeof projectSchema>;
