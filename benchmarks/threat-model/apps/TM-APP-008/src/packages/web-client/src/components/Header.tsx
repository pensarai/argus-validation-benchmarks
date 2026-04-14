import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import NotificationBell from './NotificationBell';
import Avatar from './Avatar';

export default function Header(): React.ReactElement {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="logo" onClick={() => navigate('/dashboard')}>
          ProjectHub
        </span>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search projects, tasks, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="header-right">
        <NotificationBell />
        <div className="user-menu" onClick={() => setShowDropdown(!showDropdown)}>
          <Avatar name={user?.name || ''} avatarUrl={user?.avatarUrl} size="sm" />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={() => navigate('/settings')}>Settings</button>
              <hr />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
