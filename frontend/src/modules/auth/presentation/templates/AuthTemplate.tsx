import React from 'react';

interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div style={containerStyle}>
      <div className="glass-panel" style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={logoIconStyle}>P</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1rem', color: '#fff' }}>{title}</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{subtitle}</p>
        </div>

        {children}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {footer}
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '1.5rem',
  background: '#06080e',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '430px',
  padding: '2.5rem',
  background: 'rgba(15, 19, 28, 0.75)',
};

const logoIconStyle: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.5rem',
  color: '#fff',
  margin: '0 auto',
};
