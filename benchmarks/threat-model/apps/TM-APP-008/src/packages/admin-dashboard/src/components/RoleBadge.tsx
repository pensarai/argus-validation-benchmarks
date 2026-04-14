import React from 'react';

interface RoleBadgeProps { role: string; }

const roleColors: Record<string, string> = { user: '#95a5a6', admin: '#3498db', superadmin: '#9b59b6' };

export default function RoleBadge({ role }: RoleBadgeProps): React.ReactElement {
  return (
    <span className="role-badge" style={{ backgroundColor: roleColors[role] || '#95a5a6', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' }}>
      {role}
    </span>
  );
}
