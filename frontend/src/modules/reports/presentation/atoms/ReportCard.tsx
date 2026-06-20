import React from 'react';

interface ReportCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="glass-panel" style={statCardStyle}>
      <div style={statIconContainerStyle(color)}>
        {icon}
      </div>
      <div>
        <p style={statLabelStyle}>{title}</p>
        <h2 style={statValueStyle}>{value}</h2>
      </div>
    </div>
  );
};

const statCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '1.75rem',
  gap: '1.25rem',
  background: 'rgba(15, 19, 28, 0.45)',
};

const statIconContainerStyle = (color: string): React.CSSProperties => {
  let rgbColor = '59, 130, 246'; // blue
  if (color === 'var(--accent)') rgbColor = '168, 85, 247'; // purple
  if (color === 'var(--success)') rgbColor = '16, 185, 129'; // green

  return {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: `rgba(${rgbColor}, 0.1)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
};

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
