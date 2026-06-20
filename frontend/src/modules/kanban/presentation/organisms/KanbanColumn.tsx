import React from 'react';
import { Trash2 } from 'lucide-react';
import { KanbanTaskCard } from '../molecules/KanbanTaskCard';
import type { Task } from '../../../tasks/domain/task.types';

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  colColor: string;
  colStatuses: string[];
  isDraggingOver: boolean;
  onDragOver: (e: React.DragEvent, status: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (task: Task, direction: 'left' | 'right') => void;
  onDeleteColumn: (columnName: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  colColor,
  colStatuses,
  isDraggingOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onDeleteColumn,
}) => {
  const isSinIniciar = status.toLowerCase() === 'sin iniciar';
  const statusIndex = colStatuses.indexOf(status);

  return (
    <div
      className={`kanban-column ${isDraggingOver ? 'kanban-column-dragover' : ''}`}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      style={{ borderTop: `4px solid ${colColor}`, minWidth: '320px', flex: 1 }}
    >
      <div className="kanban-column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colColor,
              display: 'inline-block',
            }}
          />
          <span className="kanban-column-title" style={{ textTransform: 'capitalize' }}>
            {status}
          </span>
          <span className="kanban-column-count">{tasks.length}</span>
        </div>

        {!isSinIniciar && (
          <button
            onClick={() => onDeleteColumn(status)}
            style={deleteColButtonStyle}
            title={`Eliminar columna "${status}"`}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="kanban-cards-list">
        {tasks.length === 0 ? (
          <div style={emptyColumnStyle}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Arrastra tareas aquí
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanTaskCard
              key={task._id}
              task={task}
              onDragStart={onDragStart}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              showLeftArrow={statusIndex > 0}
              showRightArrow={statusIndex < colStatuses.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const emptyColumnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px dashed rgba(255, 255, 255, 0.04)',
  borderRadius: '12px',
  padding: '2.5rem 1rem',
  textAlign: 'center',
  flex: 1,
};

const deleteColButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '0.2rem',
  borderRadius: '4px',
  transition: 'var(--transition-smooth)',
};
