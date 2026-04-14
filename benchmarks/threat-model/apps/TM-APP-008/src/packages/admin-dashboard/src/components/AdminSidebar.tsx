import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/users', label: 'Users', icon: 'people' },
  { path: '/admin/roles', label: 'Roles', icon: 'security' },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: 'history' },
  { path: '/admin/organizations', label: 'Organizations', icon: 'business' },
  { path: '/admin/system', label: 'System Health', icon: 'monitor' },
];

export default function AdminSidebar(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAdminStore();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="admin-logo">Admin</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">{collapsed ? '>' : '<'}</button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">{item.icon.charAt(0).toUpperCase()}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {!collapsed && currentUser && (
        <div className="sidebar-user">
          <span>{currentUser.name}</span>
          <span className="user-role">{currentUser.role}</span>
        </div>
      )}
    </aside>
  );
}
