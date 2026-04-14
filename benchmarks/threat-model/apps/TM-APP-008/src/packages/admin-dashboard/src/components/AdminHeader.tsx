import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSystemHealth } from '../api/hooks/useSystemHealth';
import { useAdminStore } from '../store/adminStore';

const routeNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/roles': 'Role Management',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/organizations': 'Organizations',
  '/admin/system': 'System Health',
};

export default function AdminHeader(): React.ReactElement {
  const location = useLocation();
  const { data: health } = useSystemHealth();
  const { currentUser } = useAdminStore();
  const pageName = routeNames[location.pathname] || 'Admin';

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="page-title">Admin Dashboard</h1>
        <nav className="breadcrumb">
          <span>Admin</span> / <span>{pageName}</span>
        </nav>
      </div>
      <div className="header-right">
        <span className={`health-indicator ${health?.database === 'healthy' ? 'healthy' : 'unhealthy'}`} />
        <span className="admin-user">{currentUser?.name}</span>
      </div>
    </header>
  );
}
