import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, ArrowUpDown } from 'lucide-react';
import api from '../../../../core/infrastructure/api';
import { ProjectModal } from '../components/ProjectModal';

interface Project {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaLimite: string;
}

export const ProjectsPage: React.FC = () => {
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
    // Debounce search slightly or just load on search state changes
    const handler = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(handler);
  }, [search, sort]);

  const handleCreateOrUpdate = async (data: { nombre: string; descripcion: string; fechaLimite: string }) => {
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

  const handleDelete = async (id: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <h1>Proyectos</h1>
          <p>Gestiona y planifica tus proyectos de desarrollo</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Filters & Actions Bar */}
      <div className="glass-panel" style={filtersBarStyle}>
        <div style={searchContainerStyle}>
          <Search size={18} style={searchIconStyle} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre..."
            style={searchInputStyle}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
          <select
            className="form-input"
            style={selectInputStyle}
            value={sort}
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Fecha Límite (Lejana a Cercana)</option>
            <option value="asc">Fecha Límite (Cercana a Lejana)</option>
          </select>
        </div>
      </div>

      {/* Projects List / Table */}
      {error && <div style={alertErrorStyle}>{error}</div>}

      {isLoading ? (
        <div style={loadingStyle}>Cargando proyectos...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={emptyStateStyle}>
          <BriefcaseIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No hay proyectos registrados</h3>
          <p style={{ marginTop: '0.25rem' }}>Empieza creando tu primer proyecto haciendo clic en el botón superior.</p>
        </div>
      ) : (
        <div className="data-table-container glass-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Descripción</th>
                <th>Fecha Límite</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td style={{ fontWeight: 600, color: '#fff', width: '25%' }}>
                    {project.nombre}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', width: '45%' }}>
                    {project.descripcion}
                  </td>
                  <td style={{ width: '15%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      <span>{formatDate(project.fechaLimite)}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', width: '15%' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem 0.6rem' }}
                        onClick={() => openEditModal(project)}
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.4rem 0.6rem' }}
                        onClick={() => handleDelete(project._id)}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Creation/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        project={selectedProject}
        isLoading={isSubmitLoading}
      />
    </div>
  );
};

// Custom Mini Icon for empty state
const BriefcaseIcon = ({ size, style }: { size: number; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

// Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const filtersBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  gap: '1.5rem',
  marginBottom: '1.5rem',
  background: 'rgba(15, 19, 28, 0.45)',
  flexWrap: 'wrap',
};

const searchContainerStyle: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  minWidth: '240px',
};

const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '0.85rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)',
};

const searchInputStyle: React.CSSProperties = {
  paddingLeft: '2.5rem',
};

const selectInputStyle: React.CSSProperties = {
  width: 'auto',
  minWidth: '240px',
};

const emptyStateStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  background: 'rgba(15, 19, 28, 0.3)',
  border: '1px dashed var(--border-glass)',
};

const alertErrorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  marginBottom: '1.5rem',
  fontWeight: 500,
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem',
  color: 'var(--text-secondary)',
};
