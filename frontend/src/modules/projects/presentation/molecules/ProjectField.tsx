import React from 'react';
import { ProjectInput } from '../atoms/ProjectInput';

interface ProjectFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export const ProjectField: React.FC<ProjectFieldProps> = ({ label, error, id, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <ProjectInput id={id} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
