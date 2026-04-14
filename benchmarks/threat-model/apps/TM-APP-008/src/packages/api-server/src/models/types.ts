import type { User, Organization, Project, Task } from '@prisma/client';

/**
 * Extended model types with computed fields not in the Prisma schema.
 */

export interface UserWithOrgs extends User {
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
  }>;
}

export interface ProjectWithStats extends Project {
  stats: {
    totalTasks: number;
    todoCount: number;
    inProgressCount: number;
    inReviewCount: number;
    doneCount: number;
    cancelledCount: number;
  };
  memberCount: number;
}

export interface TaskWithRelations extends Task {
  project: { id: string; name: string; slug: string };
  assignee: { id: string; name: string; avatarUrl: string | null } | null;
  creator: { id: string; name: string; avatarUrl: string | null };
  commentCount: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  details: Record<string, unknown>;
  ip: string | null;
  createdAt: Date;
  user: { id: string; name: string; email: string } | null;
}
