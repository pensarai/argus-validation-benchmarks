import React, { useState } from 'react';
import { useRoles, useUpdateRolePermissions } from '../api/hooks/useRoles';
import RoleBadge from '../components/RoleBadge';

const PERMISSION_CATEGORIES = ['users', 'projects', 'tasks', 'organizations', 'webhooks', 'admin'];
const ACTIONS = ['read', 'create', 'update', 'delete'];

export default function RoleManagement(): React.ReactElement {
  const { data: roles, isLoading } = useRoles();
  const updatePermissions = useUpdateRolePermissions();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  if (isLoading) return <div>Loading roles...</div>;

  return (
    <div className="role-management">
      <h1>Role Management</h1>
      <p className="subtitle">Configure role permissions for the platform</p>

      <div className="roles-list">
        {(roles || []).map((role: any) => (
          <div key={role.id} className={`role-card ${selectedRole === role.id ? 'selected' : ''}`} onClick={() => setSelectedRole(role.id)}>
            <RoleBadge role={role.id} />
            <h3>{role.name}</h3>
            <p>{role.permissions.length} permissions</p>
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="permission-matrix">
          <h3>Permissions for: {selectedRole}</h3>
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Resource</th>
                {ACTIONS.map((a) => <th key={a}>{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_CATEGORIES.map((cat) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  {ACTIONS.map((action) => (
                    <td key={action}>
                      <input type="checkbox" defaultChecked={selectedRole === 'superadmin'} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => updatePermissions.mutate({ roleId: selectedRole, permissions: [] })}>
            Save Permissions
          </button>
        </div>
      )}
    </div>
  );
}
