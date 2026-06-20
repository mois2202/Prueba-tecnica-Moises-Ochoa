import React from 'react';
import { AuthInput } from '../atoms/AuthInput';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthField: React.FC<AuthFieldProps> = ({ label, error, id, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <AuthInput id={id} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
