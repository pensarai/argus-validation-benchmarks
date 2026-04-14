import { z } from 'zod';

/**
 * Search query schema.
 * Used for full-text search across users, projects, and tasks.
 */

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  type: z
    .enum(['user', 'project', 'task', 'all'], {
      errorMap: () => ({ message: 'Type must be user, project, task, or all' }),
    })
    .default('all'),
  sort: z.enum(['relevance', 'date', 'name']).default('relevance'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
