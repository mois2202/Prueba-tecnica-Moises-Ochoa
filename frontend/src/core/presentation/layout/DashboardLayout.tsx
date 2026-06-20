import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, ClipboardList, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../application/store/authStore';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Proyectos', path: '/projects', icon: Briefcase },
    { label: 'Tareas', path: '/tasks', icon: ClipboardList },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dashboard-grid">
      {/* Mobile Top Bar */}
      <div className="mobile-header" style={mobileHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={logoIconStyle}>P</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>ProjectManager</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={menuButtonStyle}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`glass-panel ${sidebarOpen ? 'mobile-open' : ''}`} style={sidebarStyle}>
        <div style={sidebarTopStyle}>
          <div style={logoContainerStyle}>
            <div style={logoIconStyle}>P</div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>ProjectManager</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Panel de Control</p>
            </div>
          </div>
        </div>

        <nav style={navStyle}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={isActive ? activeLinkStyle : linkStyle}
              >
                <Icon size={18} style={isActive ? { color: 'var(--primary)' } : { color: 'var(--text-secondary)' }} />
                <span>{item.label}</span>
                {isActive && <div style={activeIndicatorStyle} />}
              </Link>
            );
          })}
        </nav>

        {/* Profile Card & Logout */}
        <div style={sidebarBottomStyle}>
          {user && (
            <div style={profileCardStyle}>
              <div style={avatarStyle}>{getInitials(user.nombre)}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.nombre}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={logoutButtonStyle} className="btn">
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content-area">
        {/* Render page routing content */}
        <Outlet />
      </main>

      {/* Inject mobile styles dynamically */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            padding-top: 60px;
          }
          aside {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            transform: translateX(-100%);
            z-index: 999;
          }
          aside.mobile-open {
            transform: translateX(0) !important;
          }
          .content-area {
            height: calc(100vh - 60px) !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

// Styles
const sidebarStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: 'var(--sidebar-width)',
  borderRadius: '0px',
  borderTop: 'none',
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: '1px solid var(--border-glass)',
  background: 'rgba(10, 13, 22, 0.8)',
  position: 'relative',
  transition: 'transform 0.3s ease',
};

const mobileHeaderStyle: React.CSSProperties = {
  display: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '60px',
  background: 'rgba(10, 13, 22, 0.9)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid var(--border-glass)',
  padding: '0 1.5rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1000,
};

const menuButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const sidebarTopStyle: React.CSSProperties = {
  padding: '2rem 1.5rem',
  borderBottom: '1px solid var(--border-glass)',
};

const logoContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const logoIconStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.25rem',
  color: '#fff',
};

const navStyle: React.CSSProperties = {
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  flex: 1,
};

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  padding: '0.85rem 1rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  borderRadius: '8px',
  position: 'relative',
  transition: 'all 0.2s ease',
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#fff',
  background: 'rgba(99, 102, 241, 0.08)',
};

const activeIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: '20%',
  bottom: '20%',
  width: '3px',
  background: 'var(--primary)',
  borderRadius: '0 4px 4px 0',
};

const sidebarBottomStyle: React.CSSProperties = {
  padding: '1.5rem',
  borderTop: '1px solid var(--border-glass)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const profileCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '10px',
  border: '1px solid var(--border-glass)',
};

const avatarStyle: React.CSSProperties = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'rgba(99, 102, 241, 0.15)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.9rem',
};

const logoutButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  color: 'var(--danger)',
  padding: '0.75rem',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
};
