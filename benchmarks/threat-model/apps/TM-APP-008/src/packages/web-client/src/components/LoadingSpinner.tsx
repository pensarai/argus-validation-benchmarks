import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps): React.ReactElement {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="spinner-ring" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}
