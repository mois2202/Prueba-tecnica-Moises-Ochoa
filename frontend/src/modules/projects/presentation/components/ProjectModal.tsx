import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { X } from 'lucide-react';

interface Project {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string; fechaLimite: string }) => Promise<void>;
  project?: Project | null;
  isLoading: boolean;
}

// Zod Form validation schema
const projectSchema = z.object({
  nombre: z.string().min(1, 'El nombre del proyecto es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fechaLimite: z.string().min(1, 'La fecha límite es obligatoria'),
});

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  isLoading,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (project) {
      setNombre(project.nombre);
      setDescripcion(project.descripcion);
      // Format ISO date to YYYY-MM-DD for date input
      const date = new Date(project.fechaLimite);
      const formattedDate = date.toISOString().split('T')[0];
      setFechaLimite(formattedDate);
    } else {
      setNombre('');
      setDescripcion('');
      setFechaLimite('');
    }
    setErrors({});
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = projectSchema.safeParse({ nombre, descripcion, fechaLimite });
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

    await onSubmit({ nombre, descripcion, fechaLimite });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel" style={{ background: '#0f131c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-nombre">Nombre del Proyecto</label>
            <input
              id="proj-nombre"
              type="text"
              className="form-input"
              placeholder="Ej. Rediseño del sitio web"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isLoading}
            />
            {errors.nombre && <span className="form-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-desc">Descripción</label>
            <textarea
              id="proj-desc"
              className="form-input"
              rows={4}
              placeholder="Describa los objetivos y detalles del proyecto..."
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoading}
            />
            {errors.descripcion && <span className="form-error">{errors.descripcion}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="proj-fecha">Fecha Límite</label>
            <input
              id="proj-fecha"
              type="date"
              className="form-input"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              disabled={isLoading}
            />
            {errors.fechaLimite && <span className="form-error">{errors.fechaLimite}</span>}
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
              {isLoading ? 'Guardando...' : project ? 'Actualizar' : 'Crear Proyecto'}
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
