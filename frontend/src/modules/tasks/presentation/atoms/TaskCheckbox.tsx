import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface TaskCheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ checked, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={checkboxButtonStyle}
      title={checked ? 'Marcar como pendiente' : 'Marcar como completada'}
    >
      {checked ? (
        <CheckSquare size={18} style={{ color: 'var(--success)' }} />
      ) : (
        <Square size={18} style={{ color: 'var(--text-muted)' }} />
      )}
    </button>
  );
};

const checkboxButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
