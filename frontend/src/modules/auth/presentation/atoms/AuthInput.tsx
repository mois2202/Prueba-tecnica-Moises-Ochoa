import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const AuthInput: React.FC<AuthInputProps> = (props) => {
  return (
    <input
      className="form-input"
      {...props}
    />
  );
};
