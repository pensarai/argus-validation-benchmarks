import { z } from 'zod';

/**
 * Audit log query schema.
 * Used for filtering and paginating audit log entries.
 */

const auditActionEnum = z.enum([
  'user.created',
  'user.updated',
  'user.deleted',
  'user.role_changed',
  'user.login',
  'user.logout',
  'org.created',
  'org.updated',
  'org.deleted',
  'org.member_added',
  'org.member_removed',
  'project.created',
  'project.updated',
  'project.deleted',
  'task.created',
  'task.updated',
  'task.status_changed',
  'webhook.created',
  'webhook.tested',
  'settings.updated',
]);

const auditResourceEnum = z.enum([
  'user',
  'organization',
  'project',
  'task',
  'webhook',
  'settings',
]);

export const AuditLogQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  action: auditActionEnum.optional(),
  resource: auditResourceEnum.optional(),
  userId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 90 && diffDays >= 0;
    }
    return true;
  },
  { message: 'Date range must be between 0 and 90 days', path: ['endDate'] }
);

export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>;
