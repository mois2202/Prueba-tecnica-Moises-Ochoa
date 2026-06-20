import React from 'react';

interface ProjectsTemplateProps {
  header: React.ReactNode;
  filters: React.ReactNode;
  table: React.ReactNode;
  modal: React.ReactNode;
  error: string | null;
  isLoading: boolean;
}

export const ProjectsTemplate: React.FC<ProjectsTemplateProps> = ({
  header,
  filters,
  table,
  modal,
  error,
  isLoading,
}) => {
  return (
    <div>
      {header}

      {filters}

      {error && <div style={alertErrorStyle}>{error}</div>}

      {isLoading ? (
        <div style={loadingStyle}>Cargando proyectos...</div>
      ) : (
        table
      )}

      {modal}
    </div>
  );
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
