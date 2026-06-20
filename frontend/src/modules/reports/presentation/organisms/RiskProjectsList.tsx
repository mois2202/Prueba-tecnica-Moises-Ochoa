import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RiskItem } from '../../domain/report.types';
import { RiskListItem } from '../molecules/RiskListItem';

interface RiskProjectsListProps {
  alertas: RiskItem[];
}

export const RiskProjectsList: React.FC<RiskProjectsListProps> = ({ alertas }) => {
  return (
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
            <RiskListItem
              key={item._id}
              index={index}
              nombre={item.nombre}
              tareasPendientes={item.tareasPendientes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const riskCardStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'rgba(15, 19, 28, 0.45)',
  height: 'fit-content',
};
