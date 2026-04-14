/**
 * Pagination helpers for Prisma queries.
 */

interface PaginationQuery {
  limit: number;
  offset: number;
}

interface CursorQuery {
  cursor?: string;
  limit: number;
  direction: 'forward' | 'backward';
}

/**
 * Converts limit/offset to Prisma skip/take.
 */
export function buildPaginationQuery(params: PaginationQuery) {
  return {
    take: Math.min(params.limit, 100),
    skip: Math.max(params.offset, 0),
  };
}

/**
 * Converts cursor pagination to Prisma cursor query.
 */
export function buildCursorQuery(params: CursorQuery) {
  const query: any = {
    take: params.direction === 'backward' ? -(params.limit + 1) : params.limit + 1,
  };

  if (params.cursor) {
    query.cursor = { id: params.cursor };
    query.skip = 1; // Skip the cursor item itself
  }

  return query;
}

/**
 * Formats a paginated response with metadata.
 */
export function formatPaginatedResponse<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number
) {
  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    pageCount: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  };
}

/**
 * Formats a cursor-paginated response.
 */
export function formatCursorResponse<T extends { id: string }>(
  items: T[],
  limit: number,
  direction: 'forward' | 'backward'
) {
  const hasMore = items.length > limit;
  const trimmedItems = hasMore ? items.slice(0, limit) : items;

  return {
    items: trimmedItems,
    hasMore,
    nextCursor: hasMore ? trimmedItems[trimmedItems.length - 1]?.id : null,
    prevCursor: trimmedItems.length > 0 ? trimmedItems[0].id : null,
  };
}
