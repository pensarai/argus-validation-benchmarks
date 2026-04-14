import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

export default function Tasks(): React.ReactElement {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dueDate');

  const { data, isLoading } = useQuery({
    queryKey: ['my-tasks', statusFilter, priorityFilter, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      params.set('sortBy', sortBy);
      const response = await apiClient.get(`/api/tasks?${params.toString()}`);
      return response.data.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const tasks = data?.items || [];
  const statuses = ['', 'todo', 'in_progress', 'in_review', 'done'];
  const priorities = ['', 'low', 'medium', 'high', 'critical'];

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>
      <div className="filters-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {priorities.map((p) => <option key={p} value={p}>{p || 'All priorities'}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="createdAt">Created</option>
        </select>
      </div>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks match your filters.</p>
        ) : (
          tasks.map((task: any) => (
            <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} status={task.status} assignee={task.assignee} dueDate={task.dueDate} tags={task.tags || []} />
          ))
        )}
      </div>
    </div>
  );
}
