import { z } from 'zod';
import { TaskCreateSchema, TaskUpdateSchema } from '../schemas/task';

export type TaskCreateType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateType = z.infer<typeof TaskUpdateSchema>;

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  dueDate: Date | null;
  tags: string[];
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithComments extends Task {
  comments: Array<{
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
  }>;
  assignee?: { id: string; name: string; avatarUrl: string | null } | null;
  creator: { id: string; name: string; avatarUrl: string | null };
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskStatusTransition {
  from: TaskStatus;
  to: TaskStatus;
  allowedBy: string[];
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  tags?: string[];
}

export type TaskSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'position' | 'title';

export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress', 'cancelled'],
  in_progress: ['in_review', 'todo', 'cancelled'],
  in_review: ['done', 'in_progress', 'cancelled'],
  done: ['in_progress'],
  cancelled: ['todo'],
} as const;
