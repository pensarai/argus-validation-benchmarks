import { z } from 'zod';

/**
 * Comment-related Zod schemas.
 * Comments belong to tasks and support threading via parentId.
 */

export const CommentCreateSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be under 2000 characters')
    .transform((val) => val.replace(/\s{3,}/g, '  ').trim()),
  taskId: z.string().uuid('Must be a valid task ID'),
  parentId: z.string().uuid('Must be a valid comment ID').optional(),
});

export const CommentUpdateSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000)
    .transform((val) => val.replace(/\s{3,}/g, '  ').trim()),
});

export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;
