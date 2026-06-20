import React from 'react';
import { Calendar, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskBadge } from '../../../tasks/presentation/atoms/TaskBadge';
import type { Task } from '../../../tasks/domain/task.types';

interface KanbanTaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (task: Task, direction: 'left' | 'right') => void;
  showLeftArrow: boolean;
  showRightArrow: boolean;
}

export const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  onDragStart,
  onEdit,
  onDelete,
  onMove,
  showLeftArrow,
  showRightArrow,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
    >
      <div className="kanban-card-header">
        <span className="kanban-card-title">{task.titulo}</span>
        <TaskBadge type="priority" value={task.prioridad} />
      </div>

      {task.descripcion && (
        <p className="kanban-card-desc" title={task.descripcion}>
          {task.descripcion}
        </p>
      )}

      <div className="kanban-card-footer">
        <div className="kanban-card-date">
          {task.fechaVencimiento ? (
            <>
              <Calendar size={12} style={{ color: 'var(--primary)' }} />
              <span>{formatDate(task.fechaVencimiento)}</span>
            </>
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Sin fecha</span>
          )}
        </div>

        <div className="kanban-card-actions">
          {/* Move left */}
          {showLeftArrow && (
            <button
              className="kanban-card-action-btn move-btn"
              onClick={() => onMove(task, 'left')}
              title="Mover a columna anterior"
            >
              <ChevronLeft size={14} />
            </button>
          )}

          {/* Edit */}
          <button
            className="kanban-card-action-btn"
            onClick={() => onEdit(task)}
            title="Editar tarea"
          >
            <Edit2 size={12} />
          </button>

          {/* Delete */}
          <button
            className="kanban-card-action-btn danger-btn"
            onClick={() => onDelete(task._id)}
            title="Eliminar tarea"
          >
            <Trash2 size={12} />
          </button>

          {/* Move right */}
          {showRightArrow && (
            <button
              className="kanban-card-action-btn move-btn"
              onClick={() => onMove(task, 'right')}
              title="Mover a columna siguiente"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
