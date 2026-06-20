import React from 'react';
import { Link } from 'react-router-dom';
import { AuthTemplate } from '../templates/AuthTemplate';
import { LoginForm } from '../organisms/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthTemplate
      title="Iniciar Sesión"
      subtitle="Gestiona tus proyectos y tareas hoy"
      footer={
        <>
          <span style={{ color: 'var(--text-secondary)' }}>¿No tienes una cuenta? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthTemplate>
  );
};
