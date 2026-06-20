import React, { useState, useEffect } from 'react';
import { Briefcase, CheckSquare, AlertTriangle, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';
import api from '../../../../core/infrastructure/api';

interface StatsSummary {
  totalProyectos: number;
  totalTareas: number;
  porcentajeCompletado: number;
}

interface StatusItem {
  estado: string;
  cantidad: number;
}

interface RiskItem {
  _id: string;
  tareasPendientes: number;
  nombre: string;
}

interface ProductivityItem {
  fecha: string;
  cantidad: number;
}

interface ReportData {
  resumenGlobal: StatsSummary;
  distribucionEstados: StatusItem[];
  alertasRiesgo: RiskItem[];
  productividadHistorica: ProductivityItem[];
}

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/reportes');
      setData(response.data);
    } catch (err: any) {
      setError('Error al obtener los datos analíticos del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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

  // Helper to draw SVG Line Chart for Completed Tasks
  const renderProductivityChart = () => {
    if (historial.length === 0) {
      return (
        <div style={emptyChartStyle}>
          <TrendingUp size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <span>No hay tareas completadas en los últimos 30 días para graficar.</span>
        </div>
      );
    }

    const width = 600;
    const height = 200;
    const padding = 30;

    const maxVal = Math.max(...historial.map((d) => d.cantidad), 1);
    
    // Map data points
    const points = historial.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(historial.length - 1, 1);
      const y = height - padding - (d.cantidad * (height - padding * 2)) / maxVal;
      return { x, y, label: d.fecha.slice(5), value: d.cantidad };
    });

    // Create SVG path string
    const linePath = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Area path under the line
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '500px', height: 'auto' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />

          {/* Gradient Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {/* Path Line */}
          {linePath && <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

          {/* Dots and Labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--primary)" stroke="#090d16" strokeWidth="2" />
              {/* Show label at first, last and middle points for readability */}
              {(i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) && (
                <>
                  <text x={p.x} y={height - 10} fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                    {p.label}
                  </text>
                  <text x={p.x} y={p.y - 10} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {p.value}
                  </text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Helper to draw SVG Bar Chart for Status Distribution
  const renderBarChart = () => {
    const total = distribucion.reduce((sum, item) => sum + item.cantidad, 0);
    if (total === 0) {
      return (
        <div style={emptyChartStyle}>
          <BarChart2 size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <span>No hay tareas registradas para calcular distribución.</span>
        </div>
      );
    }

    const width = 400;
    const height = 180;
    const padding = 20;

    const maxVal = Math.max(...distribucion.map((d) => d.cantidad), 1);
    const barWidth = 45;
    const gap = 50;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height}>
          {distribucion.map((item, index) => {
            const barHeight = (item.cantidad * (height - padding * 2.5)) / maxVal;
            const x = padding + index * (barWidth + gap) + 40;
            const y = height - padding - barHeight - 10;
            
            // Choose color by status name
            let color = 'var(--secondary)';
            if (item.estado === 'completada') color = 'var(--success)';
            if (item.estado === 'en progreso') color = 'var(--warning)';

            return (
              <g key={item.estado}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill={color}
                  opacity="0.85"
                />
                {/* Value label */}
                <text x={x + barWidth / 2} y={y - 8} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle">
                  {item.cantidad}
                </text>
                {/* Label text */}
                <text x={x + barWidth / 2} y={height - 5} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" style={{ textTransform: 'capitalize' }}>
                  {item.estado}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div>
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

      {/* Stats Summary Cards */}
      {resumen && (
        <div style={statsGridStyle}>
          {/* Card 1: Projects */}
          <div className="glass-panel" style={statCardStyle}>
            <div style={statIconContainerStyle('var(--secondary)')}>
              <Briefcase size={22} style={{ color: 'var(--secondary)' }} />
            </div>
            <div>
              <p style={statLabelStyle}>Total Proyectos</p>
              <h2 style={statValueStyle}>{resumen.totalProyectos}</h2>
            </div>
          </div>

          {/* Card 2: Tasks */}
          <div className="glass-panel" style={statCardStyle}>
            <div style={statIconContainerStyle('var(--accent)')}>
              <CheckSquare size={22} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p style={statLabelStyle}>Total Tareas</p>
              <h2 style={statValueStyle}>{resumen.totalTareas}</h2>
            </div>
          </div>

          {/* Card 3: Completion rate */}
          <div className="glass-panel" style={statCardStyle}>
            <div style={statIconContainerStyle('var(--success)')}>
              <TrendingUp size={22} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <p style={statLabelStyle}>Completadas (%)</p>
              <h2 style={statValueStyle}>{resumen.porcentajeCompletado}%</h2>
            </div>
          </div>
        </div>
      )}

      {/* Main Analytics Layout */}
      <div style={analyticsGridStyle}>
        {/* Left Side: Productivy & Status Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
          {/* Productivy chart card */}
          <div className="glass-panel" style={chartCardStyle}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              Productividad Histórica (Últimos 30 días)
            </h3>
            {renderProductivityChart()}
          </div>

          {/* Status distribution bar chart */}
          <div className="glass-panel" style={chartCardStyle}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} style={{ color: 'var(--success)' }} />
              Distribución de Tareas por Estado
            </h3>
            {renderBarChart()}
          </div>
        </div>

        {/* Right Side: Risk list card */}
        <div className="glass-panel" style={riskCardStyle}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            Proyectos en Mayor Riesgo
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Proyectos ordenados por el mayor número de tareas pendientes/en progreso:
          </p>

          {alertas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No hay proyectos con tareas pendientes en este momento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alertas.map((item, index) => (
                <div key={item._id} style={riskItemStyle}>
                  <div style={riskNumberStyle(index)}>{index + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.nombre}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.tareasPendientes} tareas pendientes
                    </div>
                  </div>
                  <span className="badge badge-danger">Riesgo</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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

const statCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '1.75rem',
  gap: '1.25rem',
  background: 'rgba(15, 19, 28, 0.45)',
};

const statIconContainerStyle = (color: string): React.CSSProperties => ({
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  background: `rgba(${color === 'var(--secondary)' ? '59,130,246' : color === 'var(--accent)' ? '168,85,247' : '16,185,129'}, 0.1)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const statLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  fontWeight: 500,
};

const statValueStyle: React.CSSProperties = {
  fontSize: '1.85rem',
  fontWeight: 800,
  color: '#fff',
  marginTop: '0.15rem',
};

const analyticsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '3fr 2fr',
  gap: '2rem',
};

const chartCardStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'rgba(15, 19, 28, 0.45)',
};

const emptyChartStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1rem',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
  textAlign: 'center',
  border: '1px dashed var(--border-glass)',
  borderRadius: '12px',
};

const riskCardStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'rgba(15, 19, 28, 0.45)',
  height: 'fit-content',
};

const riskItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.9rem 1rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-glass)',
  borderRadius: '12px',
};

const riskNumberStyle = (index: number): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: index === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
  color: index === 0 ? 'var(--danger)' : 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.85rem',
  fontWeight: 700,
});

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
