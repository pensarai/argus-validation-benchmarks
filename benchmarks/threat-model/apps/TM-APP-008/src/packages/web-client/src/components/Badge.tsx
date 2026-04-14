import React from 'react';

interface BadgeProps {
  variant: 'status' | 'priority' | 'role';
  value: string;
}

const colorMap: Record<string, Record<string, string>> = {
  status: { active: '#2ecc71', archived: '#95a5a6', paused: '#f39c12', todo: '#bdc3c7', in_progress: '#3498db', in_review: '#f1c40f', done: '#2ecc71', cancelled: '#e74c3c' },
  priority: { low: '#95a5a6', medium: '#3498db', high: '#f39c12', critical: '#e74c3c' },
  role: { user: '#95a5a6', admin: '#3498db', superadmin: '#9b59b6', owner: '#e74c3c', member: '#2ecc71', viewer: '#bdc3c7' },
};

export default function Badge({ variant, value }: BadgeProps): React.ReactElement {
  const bgColor = colorMap[variant]?.[value] || '#95a5a6';

  return (
    <span className={`badge badge--${variant}`} style={{ backgroundColor: bgColor, color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}
