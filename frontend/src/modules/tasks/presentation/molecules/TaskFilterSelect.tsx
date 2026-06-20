import React from 'react';

interface TaskFilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const TaskFilterSelect: React.FC<TaskFilterSelectProps> = ({ options, style, ...props }) => {
  return (
    <select
      className="form-input"
      style={{ ...filterInputStyle, ...style }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

const filterInputStyle: React.CSSProperties = {
  width: 'auto',
  flex: 1,
  minWidth: '180px',
};
