import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', text }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-8 w-8 border-t-2 border-b-2',
    large: 'h-12 w-12 border-t-4 border-b-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-sky-500`}></div>
      {text && <p className="mt-2 text-sm text-slate-400">{text}</p>}
    </div>
  );
};
