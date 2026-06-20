import { useState, useEffect } from 'react';
import api from '../../../../core/infrastructure/api';
import type { Project } from '../../domain/project.types';
import type { ProjectFormInput } from '../../domain/project.validation';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/projects', {
        params: {
          search: search || undefined,
          sort,
        },
      });
      setProjects(response.data);
    } catch (err: any) {
      setError('Error al cargar los proyectos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(handler);
  }, [search, sort]);

  const createOrUpdateProject = async (data: ProjectFormInput) => {
    setIsSubmitLoading(true);
    try {
      if (selectedProject) {
        // Edit mode
        await api.put(`/api/projects/${selectedProject._id}`, data);
      } else {
        // Create mode
        await api.post('/api/projects', data);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el proyecto.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este proyecto? Se perderán todas sus tareas asociadas.')) {
      return;
    }

    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err: any) {
      alert('Error al eliminar el proyecto.');
    }
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return {
    projects,
    search,
    setSearch,
    sort,
    setSort,
    isModalOpen,
    selectedProject,
    isLoading,
    isSubmitLoading,
    error,
    fetchProjects,
    createOrUpdateProject,
    deleteProject,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
export type UseProjectsType = ReturnType<typeof useProjects>;
