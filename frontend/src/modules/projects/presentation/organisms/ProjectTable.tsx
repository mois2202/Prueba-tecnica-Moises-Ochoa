import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import type { Project } from '../../domain/project.types';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (projects.length === 0) {
    return (
      <div className="glass-panel" style={emptyStateStyle}>
        <BriefcaseIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h3>No hay proyectos registrados</h3>
        <p style={{ marginTop: '0.25rem' }}>Empieza creando tu primer proyecto haciendo clic en el botón superior.</p>
      </div>
    );
  }

  return (
    <div className="data-table-container glass-panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Descripción</th>
            <th>Fecha Límite</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td style={{ fontWeight: 600, color: '#fff', width: '25%' }}>
                {project.nombre}
              </td>
              <td style={{ color: 'var(--text-secondary)', width: '45%' }}>
                {project.descripcion}
              </td>
              <td style={{ width: '15%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} style={{ color: 'var(--primary)' }} />
                  <span>{formatDate(project.fechaLimite)}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', width: '15%' }}>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.6rem' }}
                    onClick={() => onEdit(project)}
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.4rem 0.6rem' }}
                    onClick={() => onDelete(project._id)}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BriefcaseIcon = ({ size, style }: { size: number; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const emptyStateStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  background: 'rgba(15, 19, 28, 0.3)',
  border: '1px dashed var(--border-glass)',
};
