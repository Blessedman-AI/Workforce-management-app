import CircularSpinner from '@/components/Spinners';
import React from 'react';

const LoadingButton = ({
  type = 'button',
  className = '',
  disabled,
  loading,
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-1 w-auto py-2
         px-6 text-white ${disabled ? 'bg-purple-4 hover:bg-purple-4' : 'bg-purple-1 hover:bg-purple-3'}
        rounded-md  ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {loading && <CircularSpinner size={3} color="text-purple-3" />}
      {children}
    </button>
  );
};

export default LoadingButton;
