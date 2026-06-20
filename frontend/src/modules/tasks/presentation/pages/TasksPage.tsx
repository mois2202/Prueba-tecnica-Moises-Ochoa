import React from 'react';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '../../application/hooks/useTasks';
import { TaskTable } from '../organisms/TaskTable';
import { TaskModalForm } from '../organisms/TaskModalForm';
import { TaskFilterSelect } from '../molecules/TaskFilterSelect';
import { TasksTemplate } from '../templates/TasksTemplate';

export const TasksPage: React.FC = () => {
  const {
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
  } = useTasks();

  const totalPages = Math.ceil(total / limit) || 1;

  const header = (
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
  );

  const projectOptions = [
    { value: '', label: 'Todos los Proyectos' },
    ...projects.map((p) => ({ value: p._id, label: p.nombre })),
  ];

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'completada', label: 'Completada' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las Prioridades' },
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
  ];

  const filters = (
    <div className="glass-panel" style={filtersBarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        <Filter size={16} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filtrar por:</span>
      </div>

      <div style={filtersGridStyle}>
        <TaskFilterSelect
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          options={projectOptions}
        />
        <TaskFilterSelect
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          options={statusOptions}
        />
        <TaskFilterSelect
          value={filterPrioridad}
          onChange={(e) => setFilterPrioridad(e.target.value)}
          options={priorityOptions}
        />
      </div>
    </div>
  );

  const table = (
    <TaskTable
      tasks={tasks}
      onToggleComplete={toggleTaskComplete}
      onEdit={openEditModal}
      onDelete={deleteTask}
    />
  );

  const modal = (
    <TaskModalForm
      isOpen={isModalOpen}
      onClose={closeModal}
      onSubmit={createOrUpdateTask}
      task={selectedTask}
      isLoading={isSubmitLoading}
      projects={projects}
    />
  );

  const pagination = totalPages > 1 ? (
    <div style={paginationContainerStyle}>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Mostrando {tasks.length} de {total} tareas
      </div>
      <div style={paginationButtonsStyle}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPage(Math.max(page - 1, 1))}
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
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          <span>Siguiente</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <TasksTemplate
      header={header}
      filters={filters}
      table={table}
      modal={modal}
      pagination={pagination}
      error={error}
      isLoading={isLoading}
      tasksEmpty={tasks.length === 0}
      projectsEmpty={projects.length === 0}
    />
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
