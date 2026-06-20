import { z } from 'zod';

export const taskSchema = z.object({
  titulo: z.string().min(1, 'El título de la tarea es obligatorio'),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
  prioridad: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  proyecto: z.string().min(1, 'Debe seleccionar un proyecto asociado'),
});

export type TaskFormInput = z.infer<typeof taskSchema>;
