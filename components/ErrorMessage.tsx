import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "An Error Occurred", message }) => {
  return (
    <div className="p-3 bg-red-700/30 border border-red-500 text-red-300 rounded-lg my-2">
      <p className="font-semibold text-red-200">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};
