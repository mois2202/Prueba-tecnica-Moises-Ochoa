import type { Task, TaskProject } from '../domain/task.types';

export class TaskMapper {
  static toDomain(raw: any): Task {
    let mappedProject: TaskProject | string | null = null;
    
    if (raw.proyecto) {
      if (typeof raw.proyecto === 'object' && raw.proyecto._id) {
        mappedProject = {
          _id: raw.proyecto._id,
          nombre: raw.proyecto.nombre || 'General',
        };
      } else {
        mappedProject = String(raw.proyecto);
      }
    }

    return {
      _id: raw._id,
      titulo: raw.titulo,
      descripcion: raw.descripcion,
      estado: raw.estado || 'pendiente',
      prioridad: raw.prioridad || 'media',
      fechaVencimiento: raw.fechaVencimiento,
      proyecto: mappedProject,
    };
  }

  static toDomainList(rawList: any[]): Task[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(TaskMapper.toDomain);
  }
}
