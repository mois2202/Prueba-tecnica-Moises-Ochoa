import React from 'react';

interface RiskListItemProps {
  index: number;
  nombre: string;
  tareasPendientes: number;
}

export const RiskListItem: React.FC<RiskListItemProps> = ({ index, nombre, tareasPendientes }) => {
  return (
    <div style={riskItemStyle}>
      <div style={riskNumberStyle(index)}>{index + 1}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {nombre}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {tareasPendientes} tareas pendientes
        </div>
      </div>
      <span className="badge badge-danger">Riesgo</span>
    </div>
  );
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
