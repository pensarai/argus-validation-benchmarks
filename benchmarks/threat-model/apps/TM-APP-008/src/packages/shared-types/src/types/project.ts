import { z } from 'zod';
import { ProjectCreateSchema, ProjectUpdateSchema } from '../schemas/project';

export type ProjectCreateType = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateType = z.infer<typeof ProjectUpdateSchema>;

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organizationId: string;
  status: 'active' | 'archived' | 'paused';
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithTasks extends Project {
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    assigneeId: string | null;
  }>;
  taskCount: number;
}

export interface ProjectSettings {
  color?: string;
  icon?: string;
  defaultAssignee?: string;
  taskPrefix?: string;
  enableTimeTracking: boolean;
  enableFileAttachments: boolean;
}

export interface ProjectStats {
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  inReviewCount: number;
  doneCount: number;
  cancelledCount: number;
  overdueTasks: number;
  memberCount: number;
}
