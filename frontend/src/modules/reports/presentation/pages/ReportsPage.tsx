import React from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useReportsList } from '../../application/hooks/useReportsList';
import { ReportsTemplate } from '../templates/ReportsTemplate';
import { ExecutiveReportDocument } from '../organisms/ExecutiveReportDocument';
import { TasksReportDocument } from '../organisms/TasksReportDocument';

export const ReportsPage: React.FC = () => {
  const { projects, tasks, isLoading, error, refetch } = useReportsList();

  const header = (
    <div style={headerStyle}>
      <div>
        <h1>Reportes PDF</h1>
        <p>Genera y descarga informes detallados de tus proyectos y tareas en formato PDF</p>
      </div>
      <button className="btn btn-secondary" onClick={refetch} disabled={isLoading}>
        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
        <span>Actualizar Datos</span>
      </button>
    </div>
  );

  const content = (
    <div style={gridStyle}>
      {/* Report Card 1 */}
      <div className="glass-panel" style={cardStyle}>
        <div style={iconContainerStyle(true)}>
          <FileText size={24} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={cardTitleStyle}>Resumen Ejecutivo de Proyectos</h3>
        <p style={cardDescStyle}>
          Informe consolidado de todos los proyectos activos, sus descripciones, fechas límite y el porcentaje general de avance basado en tareas completadas.
        </p>
        <div style={footerStyle}>
          {projects.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Crea un proyecto para descargar</span>
          ) : (
            <PDFDownloadLink
              document={<ExecutiveReportDocument projects={projects} tasks={tasks} />}
              fileName={`Resumen_Ejecutivo_${new Date().toISOString().split('T')[0]}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button className="btn btn-primary" style={downloadBtnStyle} disabled={loading}>
                  <Download size={16} />
                  <span>{loading ? 'Generando PDF...' : 'Descargar PDF'}</span>
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* Report Card 2 */}
      <div className="glass-panel" style={cardStyle}>
        <div style={iconContainerStyle(false)}>
          <FileText size={24} style={{ color: 'var(--accent)' }} />
        </div>
        <h3 style={cardTitleStyle}>Reporte Detallado de Tareas</h3>
        <p style={cardDescStyle}>
          Listado estructurado de tareas agrupadas por proyecto. Incluye descripción de la tarea, estado actual, nivel de prioridad y fecha de vencimiento.
        </p>
        <div style={footerStyle}>
          {tasks.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Crea una tarea para descargar</span>
          ) : (
            <PDFDownloadLink
              document={<TasksReportDocument projects={projects} tasks={tasks} />}
              fileName={`Reporte_Tareas_${new Date().toISOString().split('T')[0]}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button
                  className="btn"
                  style={{
                    ...downloadBtnStyle,
                    background: 'linear-gradient(135deg, var(--accent), #ff79c6)',
                    color: '#fff',
                    border: 'none',
                  }}
                  disabled={loading}
                >
                  <Download size={16} />
                  <span>{loading ? 'Generando PDF...' : 'Descargar PDF'}</span>
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ReportsTemplate
      header={header}
      content={content}
      error={error}
      isLoading={isLoading}
    />
  );
};

// Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  minHeight: '280px',
  background: 'rgba(15, 19, 28, 0.45)',
  border: '1px solid var(--border-glass)',
  borderRadius: '16px',
};

const iconContainerStyle = (isPrimary: boolean): React.CSSProperties => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: isPrimary ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
});

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#fff',
  marginBottom: '0.75rem',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  marginBottom: '1.5rem',
  flex: 1,
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: 'auto',
};

const downloadBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
};
