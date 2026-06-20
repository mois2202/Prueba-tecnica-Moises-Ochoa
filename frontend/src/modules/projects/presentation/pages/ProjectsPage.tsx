import React, { useState } from 'react';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { useProjects } from '../../application/hooks/useProjects';
import { ProjectTable } from '../organisms/ProjectTable';
import { ProjectModalForm } from '../organisms/ProjectModalForm';
import { ProjectsTemplate } from '../templates/ProjectsTemplate';
import { KanbanBoard } from '../../../kanban/presentation/organisms/KanbanBoard';
import type { Project } from '../../domain/project.types';

export const ProjectsPage: React.FC = () => {
  const [activeKanbanProject, setActiveKanbanProject] = useState<Project | null>(null);

  const {
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
    createOrUpdateProject,
    deleteProject,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useProjects();

  const header = (
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
  );

  const filters = (
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
  );

  const table = (
    <ProjectTable
      projects={projects}
      onEdit={openEditModal}
      onDelete={deleteProject}
      onViewKanban={(p) => setActiveKanbanProject(p)}
    />
  );

  const modal = (
    <ProjectModalForm
      isOpen={isModalOpen}
      onClose={closeModal}
      onSubmit={createOrUpdateProject}
      project={selectedProject}
      isLoading={isSubmitLoading}
    />
  );

  if (activeKanbanProject) {
    return (
      <KanbanBoard
        project={activeKanbanProject}
        onBack={() => setActiveKanbanProject(null)}
      />
    );
  }

  return (
    <ProjectsTemplate
      header={header}
      filters={filters}
      table={table}
      modal={modal}
      error={error}
      isLoading={isLoading}
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
