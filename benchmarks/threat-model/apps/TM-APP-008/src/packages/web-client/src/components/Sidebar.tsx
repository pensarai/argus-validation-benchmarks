import React from 'react';
import { NavLink } from 'react-router-dom';
import { useOrganizations } from '../api/hooks/useOrganizations';
import { useUiStore } from '../store/uiStore';

export default function Sidebar(): React.ReactElement {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { data: orgs } = useOrganizations();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/organizations', label: 'Organizations', icon: 'building' },
    { path: '/projects', label: 'Projects', icon: 'folder' },
    { path: '/tasks', label: 'Tasks', icon: 'check-square' },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? '<' : '>'}
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {sidebarOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {sidebarOpen && orgs && (
        <div className="sidebar-orgs">
          <h4>Organizations</h4>
          <ul>
            {(Array.isArray(orgs) ? orgs : []).map((org: any) => (
              <li key={org.id}>
                <NavLink to={`/organizations/${org.id}`}>{org.name}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
