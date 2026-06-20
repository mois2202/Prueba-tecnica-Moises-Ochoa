import React from 'react';
import { CheckSquare } from 'lucide-react';

interface TasksTemplateProps {
  header: React.ReactNode;
  filters: React.ReactNode;
  table: React.ReactNode;
  modal: React.ReactNode;
  pagination: React.ReactNode;
  error: string | null;
  isLoading: boolean;
  tasksEmpty: boolean;
  projectsEmpty: boolean;
}

export const TasksTemplate: React.FC<TasksTemplateProps> = ({
  header,
  filters,
  table,
  modal,
  pagination,
  error,
  isLoading,
  tasksEmpty,
  projectsEmpty,
}) => {
  return (
    <div>
      {header}

      {filters}

      {error && <div style={alertErrorStyle}>{error}</div>}

      {isLoading ? (
        <div style={loadingStyle}>Cargando tareas...</div>
      ) : tasksEmpty ? (
        <div className="glass-panel" style={emptyStateStyle}>
          <CheckSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No se encontraron tareas</h3>
          <p style={{ marginTop: '0.25rem' }}>
            {projectsEmpty
              ? 'Primero debes crear un proyecto para poder añadir tareas.'
              : 'Intenta ajustando los filtros de búsqueda o crea una nueva tarea.'}
          </p>
        </div>
      ) : (
        <>
          {table}
          {pagination}
        </>
      )}

      {modal}
    </div>
  );
};

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

const alertErrorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  marginBottom: '1.5rem',
  fontWeight: 500,
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  color: 'var(--text-secondary)',
};
