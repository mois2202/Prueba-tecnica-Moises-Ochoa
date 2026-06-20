import React from 'react';

interface TaskBadgeProps {
  type: 'status' | 'priority';
  value: string;
}

export const TaskBadge: React.FC<TaskBadgeProps> = ({ type, value }) => {
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

  const className = type === 'status' 
    ? getStatusBadgeClass(value) 
    : getPriorityBadgeClass(value);

  return (
    <span className={className}>
      {value}
    </span>
  );
};
