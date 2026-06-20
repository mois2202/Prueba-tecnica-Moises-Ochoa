import React from 'react';

interface ReportsTemplateProps {
  header: React.ReactNode;
  content: React.ReactNode;
  error: string | null;
  isLoading: boolean;
}

export const ReportsTemplate: React.FC<ReportsTemplateProps> = ({
  header,
  content,
  error,
  isLoading,
}) => {
  return (
    <div>
      {header}

      {error && (
        <div style={alertErrorStyle}>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div style={loadingStyle}>Preparando datos para la generación de reportes...</div>
      ) : (
        content
      )}
    </div>
  );
};

const alertErrorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '1.5rem',
  fontWeight: 500,
  marginBottom: '1.5rem',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '5rem 2rem',
  color: 'var(--text-secondary)',
  fontSize: '1.1rem',
};
