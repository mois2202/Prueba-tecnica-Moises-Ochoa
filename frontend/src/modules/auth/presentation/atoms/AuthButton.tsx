import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button
      type="submit"
      className="btn btn-primary"
      style={{ width: '100%', padding: '0.85rem' }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};
