import { useState, useEffect, useCallback } from 'react';
import api from '../../../../core/infrastructure/api';
import type { Task } from '../../../tasks/domain/task.types';
import type { TaskFormInput } from '../../../tasks/domain/task.validation';
import type { Project } from '../../../projects/domain/project.types';
import { TaskMapper } from '../../../tasks/adapters/task.mapper';

export function useKanban(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      console.error('Error al cargar detalles del proyecto para el tablero', err);
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/tasks', {
        params: {
          proyecto: projectId,
          limit: 100, // Fetch up to 100 tasks of this project without page limits
        },
      });
      setTasks(TaskMapper.toDomainList(response.data.data));
    } catch (err: any) {
      setError('Error al cargar las tareas del tablero.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId, fetchProject, fetchTasks]);

  const addColumn = async (columnName: string) => {
    if (!project) return;
    const trimmed = columnName.trim();
    if (!trimmed) return;

    const currentEstados = project.estados || ['sin iniciar', 'en progreso', 'completada'];
    if (currentEstados.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
      alert('Ya existe una columna con este nombre.');
      return;
    }

    const updatedEstados = [...currentEstados, trimmed];
    setIsSubmitLoading(true);
    try {
      // Optimistic project state update
      setProject({ ...project, estados: updatedEstados });
      await api.put(`/api/projects/${project._id}`, { estados: updatedEstados });
      await fetchProject();
    } catch (err) {
      alert('Error al agregar la columna.');
      await fetchProject();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const deleteColumn = async (columnName: string) => {
    if (!project) return;
    if (columnName.toLowerCase() === 'sin iniciar') {
      alert('La columna "sin iniciar" es obligatoria y no se puede borrar.');
      return;
    }

    if (
      !window.confirm(
        `¿Está seguro de eliminar la columna "${columnName}"? Las tareas de esta columna se moverán a "sin iniciar".`
      )
    ) {
      return;
    }

    const currentEstados = project.estados || ['sin iniciar', 'en progreso', 'completada'];
    const updatedEstados = currentEstados.filter((e) => e !== columnName);

    setIsSubmitLoading(true);
    try {
      // Optimistic updates
      setProject({ ...project, estados: updatedEstados });
      setTasks((prev) =>
        prev.map((t) => (t.estado === columnName ? { ...t, estado: 'sin iniciar' } : t))
      );

      await api.put(`/api/projects/${project._id}`, { estados: updatedEstados });
      await Promise.all([fetchProject(), fetchTasks()]);
    } catch (err) {
      alert('Error al eliminar la columna.');
      await fetchProject();
      await fetchTasks();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, estado: newStatus } : t))
      );
      await api.put(`/api/tasks/${taskId}`, { estado: newStatus });
    } catch (err: any) {
      alert('Error al actualizar el estado de la tarea.');
      fetchTasks(); // Rollback on error
    }
  };

  const createOrUpdateTask = async (data: TaskFormInput) => {
    setIsSubmitLoading(true);
    try {
      if (selectedTask) {
        // Edit mode - strip project field for UpdateTaskDto compliance
        const { proyecto, ...updateData } = data;
        await api.put(`/api/tasks/${selectedTask._id}`, updateData);
      } else {
        // Create mode
        await api.post('/api/tasks', data);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar la tarea.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta tarea?')) {
      return;
    }
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err: any) {
      alert('Error al eliminar la tarea.');
    }
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return {
    tasks,
    project,
    isLoading,
    isSubmitLoading,
    error,
    fetchTasks,
    addColumn,
    deleteColumn,
    updateTaskStatus,
    createOrUpdateTask,
    deleteTask,
    isModalOpen,
    selectedTask,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
