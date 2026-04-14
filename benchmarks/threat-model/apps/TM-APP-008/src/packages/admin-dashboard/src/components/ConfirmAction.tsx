import React from 'react';

interface ConfirmActionProps { title: string; message: string; onConfirm: () => void; onCancel: () => void; destructive?: boolean; children?: React.ReactNode; }

export default function ConfirmAction({ title, message, onConfirm, onCancel, destructive = false, children }: ConfirmActionProps): React.ReactElement {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={`btn ${destructive ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
