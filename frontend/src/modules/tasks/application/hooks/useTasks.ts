import { useState, useEffect } from 'react';
import api from '../../../../core/infrastructure/api';
import type { Task } from '../../domain/task.types';
import type { TaskFormInput } from '../../domain/task.validation';
import { TaskMapper } from '../../adapters/task.mapper';

interface ProjectOption {
  _id: string;
  nombre: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  
  // Filters state
  const [filterProject, setFilterProject] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Modals & operations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error al cargar proyectos para filtros', err);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/tasks', {
        params: {
          proyecto: filterProject || undefined,
          estado: filterEstado || undefined,
          prioridad: filterPrioridad || undefined,
          page,
          limit,
        },
      });
      setTasks(TaskMapper.toDomainList(response.data.data));
      setTotal(response.data.total);
    } catch (err: any) {
      setError('Error al cargar las tareas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filterProject, filterEstado, filterPrioridad, page]);

  // Reset to first page when changing filters
  useEffect(() => {
    setPage(1);
  }, [filterProject, filterEstado, filterPrioridad]);

  const createOrUpdateTask = async (data: TaskFormInput) => {
    setIsSubmitLoading(true);
    try {
      if (selectedTask) {
        // Edit mode - strip proyecto since UpdateTaskDto forbids it
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

  const toggleTaskComplete = async (task: Task) => {
    const nextStatus = task.estado === 'completada' ? 'sin iniciar' : 'completada';
    try {
      await api.put(`/api/tasks/${task._id}`, { estado: nextStatus });
      fetchTasks();
    } catch (err: any) {
      alert('Error al actualizar el estado de la tarea.');
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      await api.delete(`/api/tasks/${id}`);
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
    projects,
    filterProject,
    setFilterProject,
    filterEstado,
    setFilterEstado,
    filterPrioridad,
    setFilterPrioridad,
    page,
    setPage,
    limit,
    total,
    isModalOpen,
    selectedTask,
    isLoading,
    isSubmitLoading,
    error,
    createOrUpdateTask,
    toggleTaskComplete,
    deleteTask,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
