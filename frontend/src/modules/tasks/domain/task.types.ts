export interface TaskProject {
  _id: string;
  nombre: string;
}

export interface Task {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
  proyecto: TaskProject | string | null;
}

export interface CreateTaskInput {
  titulo: string;
  descripcion?: string;
  estado?: string;
  prioridad?: string;
  fechaVencimiento?: string;
  proyecto: string;
}

export interface UpdateTaskInput {
  titulo?: string;
  descripcion?: string;
  estado?: string;
  prioridad?: string;
  fechaVencimiento?: string;
}
