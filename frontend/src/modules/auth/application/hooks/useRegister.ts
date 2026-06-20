import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../core/infrastructure/api';
import { registerSchema } from '../../domain/auth.validation';
import type { RegisterInput } from '../../domain/auth.validation';

export function useRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerUser = async (input: RegisterInput) => {
    setFieldErrors({});
    setApiError(null);
    setSuccessMessage(null);

    const validation = registerSchema.safeParse(input);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] !== undefined) {
          errors[String(err.path[0])] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { nombre, email, password } = input;
      await api.post('/api/auth/register', { nombre, email, password });
      setSuccessMessage('Registro exitoso. Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Error al registrarse. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
    apiError,
    successMessage,
    fieldErrors,
  };
}
