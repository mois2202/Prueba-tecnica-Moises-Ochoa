import React from 'react';
import { BarChart2 } from 'lucide-react';
import type { StatusItem } from '../../domain/report.types';

interface DistributionChartProps {
  distribucion: StatusItem[];
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ distribucion }) => {
  const total = distribucion.reduce((sum, item) => sum + item.cantidad, 0);
  
  if (total === 0) {
    return (
      <div className="glass-panel" style={chartCardStyle}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} style={{ color: 'var(--success)' }} />
          Distribución de Tareas por Estado
        </h3>
        <div style={emptyChartStyle}>
          <BarChart2 size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
          <span>No hay tareas registradas para calcular distribución.</span>
        </div>
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
    <div className="glass-panel" style={chartCardStyle}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart2 size={18} style={{ color: 'var(--success)' }} />
        Distribución de Tareas por Estado
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height}>
          {distribucion.map((item, index) => {
            const barHeight = (item.cantidad * (height - padding * 2.5)) / maxVal;
            const x = padding + index * (barWidth + gap) + 40;
            const y = height - padding - barHeight - 10;
            
            let color = 'var(--secondary)';
            if (item.estado === 'completada') color = 'var(--success)';
            if (item.estado === 'en progreso') color = 'var(--warning)';

            return (
              <g key={item.estado}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill={color}
                  opacity="0.85"
                />
                <text x={x + barWidth / 2} y={y - 8} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle">
                  {item.cantidad}
                </text>
                <text x={x + barWidth / 2} y={height - 5} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" style={{ textTransform: 'capitalize' }}>
                  {item.estado}
                </text>
              </g>
            );
          })}
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
