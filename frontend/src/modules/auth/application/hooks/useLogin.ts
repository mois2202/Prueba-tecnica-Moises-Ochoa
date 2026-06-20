import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/application/store/authStore';
import api from '../../../../core/infrastructure/api';
import { loginSchema } from '../../domain/auth.validation';
import type { LoginInput } from '../../domain/auth.validation';

export function useLogin() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loginUser = async (input: LoginInput) => {
    setFieldErrors({});
    setApiError(null);

    const validation = loginSchema.safeParse(input);
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
      const response = await api.post('/api/auth/login', input);
      const { user, access_token } = response.data;
      loginStore(user, access_token);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Error de conexión. Inténtelo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
    apiError,
    fieldErrors,
  };
}
