import React from 'react';

interface ProjectInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
  rows?: number;
}

export const ProjectInput: React.FC<ProjectInputProps> = ({ as = 'input', ...props }) => {
  if (as === 'textarea') {
    return (
      <textarea
        className="form-input"
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
  return (
    <input
      className="form-input"
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
};
