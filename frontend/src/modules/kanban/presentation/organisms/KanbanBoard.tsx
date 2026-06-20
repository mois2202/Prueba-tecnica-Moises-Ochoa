import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useKanban } from '../../application/hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import { TaskModalForm } from '../../../tasks/presentation/organisms/TaskModalForm';
import type { Task } from '../../../tasks/domain/task.types';

interface Project {
  _id: string;
  nombre: string;
  descripcion?: string;
  estados?: string[];
}

interface KanbanBoardProps {
  project: Project;
  onBack: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, onBack }) => {
  const {
    tasks,
    project: currentProject,
    isLoading,
    isSubmitLoading,
    error,
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
  } = useKanban(project._id);

  // States for adding columns
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColName, setNewColName] = useState('');

  // Drag over visual state
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const activeProject = currentProject || project;
  const colStatuses = activeProject.estados || ['sin iniciar', 'en progreso', 'completada'];

  const getColColor = (status: string, index: number) => {
    const s = status.toLowerCase();
    if (s === 'sin iniciar') return 'var(--secondary)';
    if (s === 'en progreso') return 'var(--accent)';
    if (s === 'completada') return 'var(--success)';

    const colors = ['#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#eab308'];
    return colors[index % colors.length];
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (dragOverCol !== status) {
      setDragOverCol(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await updateTaskStatus(taskId, targetStatus);
    }
  };

  // Quick move handler for accessibility & mobile
  const moveTaskQuick = async (task: Task, direction: 'left' | 'right') => {
    const currentIndex = colStatuses.indexOf(task.estado);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + (direction === 'left' ? -1 : 1);
    if (nextIndex >= 0 && nextIndex < colStatuses.length) {
      await updateTaskStatus(task._id, colStatuses[nextIndex]);
    }
  };

  const handleAddColSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newColName.trim();
    if (!name) return;
    await addColumn(name);
    setNewColName('');
    setIsAddingCol(false);
  };

  return (
    <div style={boardWrapperStyle}>
      {/* Header */}
      <div style={boardHeaderStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={onBack} style={backButtonStyle}>
            <ArrowLeft size={16} />
            <span>Volver a Proyectos</span>
          </button>
          <h1 style={{ marginTop: '0.5rem' }}>Tablero Kanban</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Proyecto: <strong style={{ color: '#fff' }}>{activeProject.nombre}</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {isLoading && tasks.length === 0 ? (
        <div style={loadingStyle}>Cargando tablero...</div>
      ) : error ? (
        <div style={errorStyle}>{error}</div>
      ) : (
        <div className="kanban-container" style={containerScrollStyle}>
          {colStatuses.map((col, index) => {
            const colTasks = tasks.filter((t) => t.estado === col);
            const isDraggingOver = dragOverCol === col;
            const colColor = getColColor(col, index);

            return (
              <KanbanColumn
                key={col}
                status={col}
                tasks={colTasks}
                colColor={colColor}
                colStatuses={colStatuses}
                isDraggingOver={isDraggingOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onMoveTask={moveTaskQuick}
                onDeleteColumn={deleteColumn}
              />
            );
          })}

          {/* Add Column Card */}
          <div style={{ minWidth: '320px', flex: 1 }}>
            {isAddingCol ? (
              <form onSubmit={handleAddColSubmit} className="kanban-column" style={{ borderTop: '4px dashed var(--primary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Nueva Columna</h4>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. En Pruebas, QA..."
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    autoFocus
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddingCol(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitLoading}>
                      Crear
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div
                onClick={() => setIsAddingCol(true)}
                className="kanban-column"
                style={addColumnCardStyle}
              >
                <Plus size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Añadir Columna</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task form modal */}
      <TaskModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={createOrUpdateTask}
        task={selectedTask}
        isLoading={isSubmitLoading}
        projects={[activeProject as any]}
      />
    </div>
  );
};

// Styles
const boardWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const boardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: 0,
  transition: 'var(--transition-smooth)',
  alignSelf: 'flex-start',
};

const addColumnCardStyle: React.CSSProperties = {
  borderStyle: 'dashed',
  borderWidth: '2px',
  borderColor: 'rgba(255,255,255,0.12)',
  background: 'rgba(15, 19, 28, 0.2)',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
};

const containerScrollStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'start',
  marginTop: '1rem',
  overflowX: 'auto',
  paddingBottom: '1.5rem',
  width: '100%',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '4rem',
  color: 'var(--text-secondary)',
};

const errorStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: 'var(--danger)',
  borderRadius: '8px',
  padding: '1rem',
  fontWeight: 500,
};
