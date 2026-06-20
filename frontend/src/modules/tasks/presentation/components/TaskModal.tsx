import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { X } from 'lucide-react';
import api from '../../../../core/infrastructure/api';

interface Project {
  _id: string;
  nombre: string;
}

interface Task {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
  proyecto: any;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    titulo: string;
    descripcion?: string;
    estado?: string;
    prioridad?: string;
    fechaVencimiento?: string;
    proyecto: string;
  }) => Promise<void>;
  task?: Task | null;
  isLoading: boolean;
}

// Zod validation schema
const taskSchema = z.object({
  titulo: z.string().min(1, 'El título de la tarea es obligatorio'),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
  prioridad: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  proyecto: z.string().min(1, 'Debe seleccionar un proyecto asociado'),
});

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [prioridad, setPrioridad] = useState('media');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [proyecto, setProyecto] = useState('');
  
  const [errors, setErrors] = useState<any>({});
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  // Load projects list to choose from in dropdown
  const loadProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error al cargar proyectos para el selector', err);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setTitulo(task.titulo);
      setDescripcion(task.descripcion || '');
      setEstado(task.estado);
      setPrioridad(task.prioridad);
      setProyecto(task.proyecto?._id || task.proyecto || '');
      
      if (task.fechaVencimiento) {
        const date = new Date(task.fechaVencimiento);
        setFechaVencimiento(date.toISOString().split('T')[0]);
      } else {
        setFechaVencimiento('');
      }
    } else {
      setTitulo('');
      setDescripcion('');
      setEstado('pendiente');
      setPrioridad('media');
      setProyecto('');
      setFechaVencimiento('');
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse({
      titulo,
      descripcion,
      estado,
      prioridad,
      fechaVencimiento: fechaVencimiento || undefined,
      proyecto,
    });

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit({
      titulo,
      descripcion,
      estado,
      prioridad,
      fechaVencimiento: fechaVencimiento || undefined,
      proyecto,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ background: '#0f131c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-titulo">Título de la Tarea</label>
            <input
              id="task-titulo"
              type="text"
              className="form-input"
              placeholder="Ej. Crear endpoint de login"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={isLoading}
            />
            {errors.titulo && <span className="form-error">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Descripción</label>
            <textarea
              id="task-desc"
              className="form-input"
              rows={3}
              placeholder="Describa el trabajo a realizar..."
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-proj">Proyecto</label>
            <select
              id="task-proj"
              className="form-input"
              value={proyecto}
              onChange={(e) => setProyecto(e.target.value)}
              disabled={isLoading || isProjectsLoading || !!task} // Block changing project on edit mode to maintain integrity
            >
              <option value="">Seleccione un proyecto...</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errors.proyecto && <span className="form-error">{errors.proyecto}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Estado</label>
              <select
                id="task-status"
                className="form-input"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={isLoading}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Prioridad</label>
              <select
                id="task-priority"
                className="form-input"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                disabled={isLoading}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="task-due">Fecha de Vencimiento</label>
            <input
              id="task-due"
              type="date"
              className="form-input"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : task ? 'Actualizar' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};
