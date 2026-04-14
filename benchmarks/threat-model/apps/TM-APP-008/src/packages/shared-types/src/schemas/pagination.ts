import { z } from 'zod';

/**
 * Pagination schemas for offset-based and cursor-based pagination.
 */

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.string().max(50).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const CursorPaginationSchema = z.object({
  cursor: z.string().max(500).optional(),
  direction: z.enum(['forward', 'backward']).default('forward'),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).default('createdAt'),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type CursorPagination = z.infer<typeof CursorPaginationSchema>;

/**
 * Helper to build a paginated response structure.
 */
export function buildPaginatedMeta(total: number, limit: number, offset: number) {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    pageCount: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  };
}
