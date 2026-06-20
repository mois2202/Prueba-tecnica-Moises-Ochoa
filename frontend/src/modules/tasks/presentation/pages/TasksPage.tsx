import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckSquare, Square, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../../core/infrastructure/api';
import { TaskModal } from '../components/TaskModal';

interface Project {
  _id: string;
  nombre: string;
}

interface Task {
  _id: string;
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
  proyecto: any; // populated project info
}

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
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
      setTasks(response.data.data);
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

  const handleCreateOrUpdate = async (data: any) => {
    setIsSubmitLoading(true);
    try {
      if (selectedTask) {
        // Edit mode
        await api.put(`/api/tasks/${selectedTask._id}`, data);
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

  const handleToggleComplete = async (task: Task) => {
    const nextStatus = task.estado === 'completada' ? 'pendiente' : 'completada';
    try {
      await api.put(`/api/tasks/${task._id}`, { estado: nextStatus });
      fetchTasks();
    } catch (err: any) {
      alert('Error al actualizar el estado de la tarea.');
    }
  };

  const handleDelete = async (id: string) => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completada': return 'badge badge-success';
      case 'en progreso': return 'badge badge-warning';
      default: return 'badge badge-info';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'alta': return 'badge badge-danger';
      case 'media': return 'badge badge-warning';
      default: return 'badge badge-success';
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <div style={headerStyle}>
        <div>
          <h1>Tareas</h1>
          <p>Supervisa, filtra y gestiona el flujo de trabajo de tus proyectos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal} disabled={projects.length === 0}>
          <Plus size={18} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={filtersBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Filter size={16} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filtrar por:</span>
        </div>

        <div style={filtersGridStyle}>
          {/* Project selector */}
          <select
            className="form-input"
            style={filterInputStyle}
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="">Todos los Proyectos</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            className="form-input"
            style={filterInputStyle}
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>

          {/* Priority selector */}
          <select
            className="form-input"
            style={filterInputStyle}
            value={filterPrioridad}
            onChange={(e) => setFilterPrioridad(e.target.value)}
          >
            <option value="">Todas las Prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      {error && <div style={alertErrorStyle}>{error}</div>}

      {/* Tasks List */}
      {isLoading ? (
        <div style={loadingStyle}>Cargando tareas...</div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={emptyStateStyle}>
          <CheckSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No se encontraron tareas</h3>
          <p style={{ marginTop: '0.25rem' }}>
            {projects.length === 0 
              ? 'Primero debes crear un proyecto para poder añadir tareas.' 
              : 'Intenta ajustando los filtros de búsqueda o crea una nueva tarea.'}
          </p>
        </div>
      ) : (
        <>
          <div className="data-table-container glass-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}></th>
                  <th style={{ width: '20%' }}>Tarea</th>
                  <th style={{ width: '30%' }}>Descripción</th>
                  <th style={{ width: '12%' }}>Proyecto</th>
                  <th style={{ width: '10%' }}>Estado</th>
                  <th style={{ width: '10%' }}>Prioridad</th>
                  <th style={{ width: '12%' }}>Vencimiento</th>
                  <th style={{ textAlign: 'right', width: '10%' }}></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} style={task.estado === 'completada' ? completedRowStyle : undefined}>
                    <td>
                      <button
                        onClick={() => handleToggleComplete(task)}
                        style={checkboxButtonStyle}
                        title={task.estado === 'completada' ? 'Marcar como pendiente' : 'Marcar como completada'}
                      >
                        {task.estado === 'completada' ? (
                          <CheckSquare size={18} style={{ color: 'var(--success)' }} />
                        ) : (
                          <Square size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </td>
                    <td style={{ fontWeight: 650, color: task.estado === 'completada' ? 'var(--text-muted)' : '#fff' }}>
                      {task.titulo}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {task.descripcion || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin descripción</span>}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {task.proyecto?.nombre || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(task.estado)}>{task.estado}</span>
                    </td>
                    <td>
                      <span className={getPriorityBadgeClass(task.prioridad)}>{task.prioridad}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                        <span>{formatDate(task.fechaVencimiento)}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => openEditModal(task)}
                          title="Editar"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleDelete(task._id)}
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={paginationContainerStyle}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Mostrando {tasks.length} de {total} tareas
              </div>
              <div style={paginationButtonsStyle}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                  <span>Anterior</span>
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${page === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setPage(pageNum)}
                      style={{ minWidth: '36px', padding: '0.5rem 0' }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  <span>Siguiente</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        task={selectedTask}
        isLoading={isSubmitLoading}
      />
    </div>
  );
};

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
  alignItems: 'center',
  padding: '1rem 1.5rem',
  gap: '1.5rem',
  marginBottom: '1.5rem',
  background: 'rgba(15, 19, 28, 0.45)',
  flexWrap: 'wrap',
};

const filtersGridStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  flex: 1,
  flexWrap: 'wrap',
  minWidth: '280px',
};

const filterInputStyle: React.CSSProperties = {
  width: 'auto',
  flex: 1,
  minWidth: '180px',
};

const checkboxButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const completedRowStyle: React.CSSProperties = {
  opacity: 0.6,
  background: 'rgba(0, 0, 0, 0.1)',
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

const paginationContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const paginationButtonsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};
