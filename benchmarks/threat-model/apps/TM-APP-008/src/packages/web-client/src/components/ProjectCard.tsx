import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@app/shared-types';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  taskCount: number;
  doneCount: number;
  memberCount: number;
  updatedAt: string;
}

export default function ProjectCard({ id, name, description, taskCount, doneCount, memberCount, updatedAt }: ProjectCardProps): React.ReactElement {
  const progress = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  return (
    <Link to={`/projects/${id}`} className="project-card">
      <h3 className="project-card-name">{name}</h3>
      {description && <p className="project-card-description">{description.slice(0, 100)}{description.length > 100 ? '...' : ''}</p>}
      <div className="project-card-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{doneCount}/{taskCount} tasks</span>
      </div>
      <div className="project-card-meta">
        <span>{memberCount} members</span>
        <span>Updated {formatRelativeTime(updatedAt)}</span>
      </div>
    </Link>
  );
}
