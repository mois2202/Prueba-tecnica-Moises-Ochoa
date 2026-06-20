import React from 'react';
import { Briefcase, CheckSquare, TrendingUp, RefreshCw } from 'lucide-react';
import { useReports } from '../../application/hooks/useReports';
import { ReportCard } from '../atoms/ReportCard';
import { ProductivityChart } from '../organisms/ProductivityChart';
import { DistributionChart } from '../organisms/DistributionChart';
import { RiskProjectsList } from '../organisms/RiskProjectsList';
import { DashboardTemplate } from '../templates/DashboardTemplate';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error, fetchReports } = useReports();

  if (isLoading && !data) {
    return <div style={loadingStyle}>Procesando métricas en el servidor...</div>;
  }

  if (error) {
    return (
      <div>
        <div style={headerStyle}>
          <h1>Dashboard</h1>
        </div>
        <div style={alertErrorStyle}>
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchReports} style={{ marginTop: '1rem' }}>
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  const resumen = data?.resumenGlobal;
  const distribucion = data?.distribucionEstados || [];
  const alertas = data?.alertasRiesgo || [];
  const historial = data?.productividadHistorica || [];

  const header = (
    <div style={headerStyle}>
      <div>
        <h1>Dashboard</h1>
        <p>Métricas y análisis del rendimiento general del proyecto</p>
      </div>
      <button className="btn btn-secondary" onClick={fetchReports}>
        <RefreshCw size={16} />
        <span>Actualizar Datos</span>
      </button>
    </div>
  );

  const summaryCards = resumen ? (
    <div style={statsGridStyle}>
      <ReportCard
        title="Total Proyectos"
        value={resumen.totalProyectos}
        icon={<Briefcase size={22} style={{ color: 'var(--secondary)' }} />}
        color="var(--secondary)"
      />
      <ReportCard
        title="Total Tareas"
        value={resumen.totalTareas}
        icon={<CheckSquare size={22} style={{ color: 'var(--accent)' }} />}
        color="var(--accent)"
      />
      <ReportCard
        title="Completadas (%)"
        value={`${resumen.porcentajeCompletado}%`}
        icon={<TrendingUp size={22} style={{ color: 'var(--success)' }} />}
        color="var(--success)"
      />
    </div>
  ) : null;

  const chartsSection = (
    <div style={analyticsGridStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
        <ProductivityChart historial={historial} />
        <DistributionChart distribucion={distribucion} />
      </div>
      <RiskProjectsList alertas={alertas} />
    </div>
  );

  return (
    <DashboardTemplate
      header={header}
      summaryCards={summaryCards}
      chartsSection={chartsSection}
    />
  );
};

// Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2.5rem',
};

const analyticsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '3fr 2fr',
  gap: '2rem',
};

const alertErrorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '1.5rem',
  fontWeight: 500,
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '5rem 2rem',
  color: 'var(--text-secondary)',
  fontSize: '1.1rem',
};
