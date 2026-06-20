import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../../../../core/application/store/authStore';
import api from '../../../../core/infrastructure/api';

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    // Validate using Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, access_token } = response.data;
      
      // Save credentials in global Zustand state
      loginStore(user, access_token);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Error de conexión. Inténtelo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="glass-panel" style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={logoIconStyle}>P</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1rem', color: '#fff' }}>Iniciar Sesión</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Gestiona tus proyectos y tareas hoy</p>
        </div>

        {apiError && (
          <div style={alertErrorStyle}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="text"
              className="form-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>¿No tienes una cuenta? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles
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
  maxWidth: '420px',
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

const alertErrorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  marginBottom: '1.5rem',
  fontWeight: 500,
};
