import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Project } from '../../domain/project.types';
import { projectSchema } from '../../domain/project.validation';
import { ProjectField } from '../molecules/ProjectField';

interface ProjectModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string; fechaLimite: string }) => Promise<void>;
  project?: Project | null;
  isLoading: boolean;
}

export const ProjectModalForm: React.FC<ProjectModalFormProps> = ({
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
          <ProjectField
            id="proj-nombre"
            label="Nombre del Proyecto"
            type="text"
            placeholder="Ej. Rediseño del sitio web"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errors.nombre}
            disabled={isLoading}
          />

          <ProjectField
            id="proj-desc"
            label="Descripción"
            as="textarea"
            rows={4}
            placeholder="Describa los objetivos y detalles del proyecto..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            error={errors.descripcion}
            disabled={isLoading}
          />

          <ProjectField
            id="proj-fecha"
            label="Fecha Límite"
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            error={errors.fechaLimite}
            disabled={isLoading}
          />

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
