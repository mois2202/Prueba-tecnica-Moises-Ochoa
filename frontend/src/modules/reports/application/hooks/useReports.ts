import { useState, useEffect } from 'react';
import api from '../../../../core/infrastructure/api';
import type { ReportData } from '../../domain/report.types';

export function useReports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/reportes');
      setData(response.data);
    } catch (err: any) {
      setError('Error al obtener los datos analíticos del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchReports,
  };
}
export type UseReportsType = ReturnType<typeof useReports>;
