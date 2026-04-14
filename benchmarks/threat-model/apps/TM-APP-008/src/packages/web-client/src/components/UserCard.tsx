import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Badge from './Badge';

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export default function UserCard({ id, name, email, role, avatarUrl }: UserCardProps): React.ReactElement {
  return (
    <div className="user-card">
      <Link to={`/users/${id}`} className="user-card-link">
        <Avatar name={name} avatarUrl={avatarUrl} size="md" />
        <div className="user-card-info">
          <span className="user-card-name">{name}</span>
          <span className="user-card-email">{email}</span>
        </div>
        <Badge variant="role" value={role} />
      </Link>
    </div>
  );
}
