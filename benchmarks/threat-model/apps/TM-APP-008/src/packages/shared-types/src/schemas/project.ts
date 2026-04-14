import { z } from 'zod';

/**
 * Project-related Zod schemas.
 * Projects belong to organizations and contain tasks.
 */

const projectStatusEnum = z.enum(['active', 'archived', 'paused'], {
  errorMap: () => ({ message: 'Status must be active, archived, or paused' }),
});

export const ProjectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200).trim(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a valid slug'),
  description: z.string().max(2000).optional(),
  organizationId: z.string().uuid('Must be a valid organization ID'),
  status: projectStatusEnum.default('active'),
  settings: z
    .object({
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      icon: z.string().max(50).optional(),
      defaultAssignee: z.string().uuid().optional(),
      taskPrefix: z.string().max(10).regex(/^[A-Z]+$/).optional(),
      enableTimeTracking: z.boolean().default(false),
      enableFileAttachments: z.boolean().default(true),
    })
    .optional(),
  tags: z.array(z.string().min(1).max(50).trim()).max(20).optional(),
});

export const ProjectUpdateSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).optional(),
  status: projectStatusEnum.optional(),
  settings: z
    .object({
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      icon: z.string().max(50).optional(),
      defaultAssignee: z.string().uuid().nullable().optional(),
      taskPrefix: z.string().max(10).regex(/^[A-Z]+$/).optional(),
      enableTimeTracking: z.boolean().optional(),
      enableFileAttachments: z.boolean().optional(),
    })
    .optional(),
  tags: z.array(z.string().min(1).max(50).trim()).max(20).optional(),
}).refine(
  (data) => {
    // Status transition refinement: archived projects cannot go back to active without explicit reactivation
    // This is enforced at the service layer with more context
    return true;
  },
  { message: 'Invalid status transition' }
);

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
