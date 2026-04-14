import { z } from 'zod';

/**
 * User settings and notification settings schemas.
 */

export const UserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().min(2).max(10).default('en'),
  timezone: z.string().max(50).default('UTC'),
  dateFormat: z
    .enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], {
      errorMap: () => ({ message: 'Invalid date format' }),
    })
    .default('YYYY-MM-DD'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  startOfWeek: z.enum(['sunday', 'monday']).default('monday'),
  compactMode: z.boolean().default(false),
  showCompletedTasks: z.boolean().default(true),
});

export const NotificationSettingsSchema = z.object({
  taskAssigned: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    inApp: z.boolean().default(true),
  }),
  taskUpdated: z.object({
    email: z.boolean().default(false),
    push: z.boolean().default(true),
    inApp: z.boolean().default(true),
  }),
  commentAdded: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    inApp: z.boolean().default(true),
  }),
  projectUpdated: z.object({
    email: z.boolean().default(false),
    push: z.boolean().default(false),
    inApp: z.boolean().default(true),
  }),
  memberJoined: z.object({
    email: z.boolean().default(false),
    push: z.boolean().default(false),
    inApp: z.boolean().default(true),
  }),
  digest: z.object({
    enabled: z.boolean().default(true),
    frequency: z.enum(['daily', 'weekly']).default('daily'),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default('09:00'),
  }),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
