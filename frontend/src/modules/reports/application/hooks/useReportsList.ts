import { useState, useEffect, useCallback } from 'react';
import api from '../../../../core/infrastructure/api';
import type { Project } from '../../../projects/domain/project.types';
import type { Task } from '../../../tasks/domain/task.types';
import { TaskMapper } from '../../../tasks/adapters/task.mapper';

export function useReportsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get('/api/projects'),
        api.get('/api/tasks', { params: { limit: 1000 } }),
      ]);
      setProjects(projectsResponse.data);
      setTasks(TaskMapper.toDomainList(tasksResponse.data.data));
    } catch (err: any) {
      setError('Error al cargar la información para generar los reportes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  return {
    projects,
    tasks,
    isLoading,
    error,
    refetch: fetchReportsData,
  };
}
