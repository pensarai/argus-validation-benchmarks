import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Badge from './Badge';

interface TaskCardProps {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignee?: { id: string; name: string; avatarUrl: string | null } | null;
  dueDate?: string | null;
  tags: string[];
}

export default function TaskCard({ id, title, priority, status, assignee, dueDate, tags }: TaskCardProps): React.ReactElement {
  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'done';

  return (
    <div className={`task-card task-card--${status}`}>
      <Link to={`/tasks/${id}`}>
        <div className="task-card-header">
          <h4 className="task-card-title">{title}</h4>
          <Badge variant="priority" value={priority} />
        </div>
        <div className="task-card-body">
          {assignee && (
            <div className="task-card-assignee">
              <Avatar name={assignee.name} avatarUrl={assignee.avatarUrl} size="sm" />
              <span>{assignee.name}</span>
            </div>
          )}
          {dueDate && (
            <span className={`task-card-due ${isOverdue ? 'overdue' : ''}`}>
              Due: {new Date(dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="task-card-tags">
            {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </Link>
    </div>
  );
}
