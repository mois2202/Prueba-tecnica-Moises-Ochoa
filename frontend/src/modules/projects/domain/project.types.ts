export interface Project {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  usuario?: string;
  estados?: string[];
}

export interface CreateProjectInput {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
}
