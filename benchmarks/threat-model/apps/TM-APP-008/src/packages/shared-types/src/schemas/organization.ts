import { z } from 'zod';

/**
 * Organization-related Zod schemas.
 * Used for creating and managing organizations and their members.
 */

export const OrgMemberSchema = z.object({
  userId: z.string().uuid('Must be a valid user ID'),
  role: z.enum(['owner', 'admin', 'member', 'viewer'], {
    errorMap: () => ({ message: 'Role must be owner, admin, member, or viewer' }),
  }),
  joinedAt: z.string().datetime().optional(),
});

export const OrganizationCreateSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100).trim(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  settings: z
    .object({
      isPublic: z.boolean().default(false),
      allowMemberInvites: z.boolean().default(true),
      defaultMemberRole: z.enum(['member', 'viewer']).default('member'),
      maxProjects: z.number().int().min(1).max(1000).default(100),
    })
    .optional(),
}).refine(
  (data) => data.slug.length >= 2,
  { message: 'Slug must be at least 2 characters', path: ['slug'] }
);

export const OrganizationUpdateSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  settings: z
    .object({
      isPublic: z.boolean().optional(),
      allowMemberInvites: z.boolean().optional(),
      defaultMemberRole: z.enum(['member', 'viewer']).optional(),
      maxProjects: z.number().int().min(1).max(1000).optional(),
    })
    .optional(),
});

export const OrgMemberAddSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
  sendInviteEmail: z.boolean().default(true),
});

export const OrgMemberUpdateSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

// Refinement: organization can have at most 500 members
export const OrgMemberListSchema = z.array(OrgMemberSchema).max(500, 'Organization cannot exceed 500 members');

export type OrganizationCreate = z.infer<typeof OrganizationCreateSchema>;
export type OrganizationUpdate = z.infer<typeof OrganizationUpdateSchema>;
export type OrgMember = z.infer<typeof OrgMemberSchema>;
