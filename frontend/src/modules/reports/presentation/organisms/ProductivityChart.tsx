import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { ProductivityItem } from '../../domain/report.types';

interface ProductivityChartProps {
  historial: ProductivityItem[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ historial }) => {
  if (historial.length === 0) {
    return (
      <div className="glass-panel" style={chartCardStyle}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          Productividad Histórica (Últimos 30 días)
        </h3>
        <div style={emptyChartStyle}>
          <TrendingUp size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <span>No hay tareas completadas en los últimos 30 días para graficar.</span>
        </div>
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...historial.map((d) => d.cantidad), 1);
  
  const points = historial.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(historial.length - 1, 1);
    const y = height - padding - (d.cantidad * (height - padding * 2)) / maxVal;
    return { x, y, label: d.fecha.slice(5), value: d.cantidad };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="glass-panel" style={chartCardStyle}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
        Productividad Histórica (Últimos 30 días)
      </h3>
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '500px', height: 'auto' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />

          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {linePath && <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--primary)" stroke="#090d16" strokeWidth="2" />
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
    </div>
  );
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
