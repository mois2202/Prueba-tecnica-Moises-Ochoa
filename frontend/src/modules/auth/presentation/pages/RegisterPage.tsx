import React from 'react';
import { Link } from 'react-router-dom';
import { AuthTemplate } from '../templates/AuthTemplate';
import { RegisterForm } from '../organisms/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthTemplate
      title="Registrarse"
      subtitle="Crea una cuenta para empezar a planificar"
      footer={
        <>
          <span style={{ color: 'var(--text-secondary)' }}>¿Ya tienes una cuenta? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthTemplate>
  );
};
