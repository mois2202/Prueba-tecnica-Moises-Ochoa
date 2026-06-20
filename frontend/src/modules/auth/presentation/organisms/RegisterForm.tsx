import React, { useState } from 'react';
import { useRegister } from '../../application/hooks/useRegister';
import { AuthField } from '../molecules/AuthField';
import { AuthButton } from '../atoms/AuthButton';

export const RegisterForm: React.FC = () => {
  const { registerUser, isLoading, apiError, successMessage, fieldErrors } = useRegister();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({ nombre, email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      {apiError && <div style={alertErrorStyle}>{apiError}</div>}
      {successMessage && <div style={alertSuccessStyle}>{successMessage}</div>}

      <AuthField
        id="nombre"
        label="Nombre Completo"
        type="text"
        placeholder="Juan Pérez"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={fieldErrors.nombre}
        disabled={isLoading}
      />

      <AuthField
        id="email"
        label="Correo Electrónico"
        type="text"
        placeholder="juan@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={isLoading}
      />

      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        disabled={isLoading}
      />

      <AuthField
        id="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        placeholder="Repite la contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        disabled={isLoading}
      />

      <AuthButton isLoading={isLoading}>
        Crear Cuenta
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

const alertSuccessStyle: React.CSSProperties = {
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  color: 'var(--success)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  marginBottom: '1.5rem',
  fontWeight: 500,
};
