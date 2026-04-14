import React, { useState } from 'react';

interface UserStatusToggleProps { active: boolean; onChange: (active: boolean) => void; }

export default function UserStatusToggle({ active, onChange }: UserStatusToggleProps): React.ReactElement {
  const [confirming, setConfirming] = useState(false);

  const handleToggle = () => {
    if (active && !confirming) { setConfirming(true); return; }
    onChange(!active);
    setConfirming(false);
  };

  return (
    <div className="status-toggle">
      {confirming ? (
        <div className="confirm-deactivate">
          <span>Deactivate?</span>
          <button onClick={handleToggle} className="btn-sm btn-danger">Yes</button>
          <button onClick={() => setConfirming(false)} className="btn-sm">No</button>
        </div>
      ) : (
        <button className={`toggle-btn ${active ? 'active' : 'inactive'}`} onClick={handleToggle}>
          {active ? 'Active' : 'Inactive'}
        </button>
      )}
    </div>
  );
}
