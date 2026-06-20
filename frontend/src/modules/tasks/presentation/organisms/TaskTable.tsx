import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import type { Task } from '../../domain/task.types';
import { TaskBadge } from '../atoms/TaskBadge';
import { TaskCheckbox } from '../atoms/TaskCheckbox';

interface TaskTableProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
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
                <TaskCheckbox
                  checked={task.estado === 'completada'}
                  onClick={() => onToggleComplete(task)}
                />
              </td>
              <td style={{ fontWeight: 650, color: task.estado === 'completada' ? 'var(--text-muted)' : '#fff' }}>
                {task.titulo}
              </td>
              <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {task.descripcion || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin descripción</span>}
              </td>
              <td>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {typeof task.proyecto === 'object' && task.proyecto !== null ? task.proyecto.nombre : 'General'}
                </span>
              </td>
              <td>
                <TaskBadge type="status" value={task.estado} />
              </td>
              <td>
                <TaskBadge type="priority" value={task.prioridad} />
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
                    onClick={() => onEdit(task)}
                    title="Editar"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.35rem 0.5rem' }}
                    onClick={() => onDelete(task._id)}
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
  );
};

const completedRowStyle: React.CSSProperties = {
  opacity: 0.6,
  background: 'rgba(0, 0, 0, 0.1)',
};
