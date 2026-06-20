import React, { useState } from 'react';
import { useLogin } from '../../application/hooks/useLogin';
import { AuthField } from '../molecules/AuthField';
import { AuthButton } from '../atoms/AuthButton';

export const LoginForm: React.FC = () => {
  const { loginUser, isLoading, apiError, fieldErrors } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {apiError && (
        <div style={alertErrorStyle}>
          {apiError}
        </div>
      )}

      <AuthField
        id="email"
        label="Correo Electrónico"
        type="text"
        placeholder="ejemplo@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={isLoading}
      />

      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        disabled={isLoading}
      />

      <AuthButton isLoading={isLoading}>
        Ingresar
      </AuthButton>
    </form>
  );
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
