import { z } from 'zod';

/**
 * Organization invite schemas.
 */

export const InviteCreateSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  organizationId: z.string().uuid('Must be a valid organization ID'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
  message: z.string().max(500).optional(),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

export const InviteAcceptSchema = z.object({
  token: z.string().min(1, 'Invite token is required').max(512),
});

export const InviteBulkCreateSchema = z.object({
  emails: z.array(z.string().email()).min(1, 'At least one email required').max(50, 'Maximum 50 invites at once'),
  organizationId: z.string().uuid(),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
  message: z.string().max(500).optional(),
});

export type InviteCreate = z.infer<typeof InviteCreateSchema>;
export type InviteAccept = z.infer<typeof InviteAcceptSchema>;
