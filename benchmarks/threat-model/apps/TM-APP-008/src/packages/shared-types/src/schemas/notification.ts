import { z } from 'zod';

/**
 * Notification preference schemas.
 * Controls how and when users receive notifications.
 */

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Must be in HH:MM format');

export const NotificationPrefsSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
  quietHours: z
    .object({
      enabled: z.boolean().default(false),
      start: timeString.default('22:00'),
      end: timeString.default('08:00'),
    })
    .optional(),
  digestFrequency: z
    .enum(['immediate', 'hourly', 'daily', 'weekly'], {
      errorMap: () => ({ message: 'Digest frequency must be immediate, hourly, daily, or weekly' }),
    })
    .default('immediate'),
  mutedChannels: z.array(z.string().max(100)).max(50).optional(),
});

export type NotificationPrefs = z.infer<typeof NotificationPrefsSchema>;
