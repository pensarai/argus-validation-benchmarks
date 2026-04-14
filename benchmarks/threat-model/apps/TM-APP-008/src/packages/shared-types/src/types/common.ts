/**
 * Common utility types used across all packages.
 */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  pageCount: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
  errors?: Array<{ code: string; message: string; field?: string }>;
}

export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

export interface DateRange {
  start: string;
  end: string;
}

/**
 * Branded type for entity IDs to prevent mixing different ID types.
 */
export type ID<T extends string = string> = string & { readonly __brand: T };

export type UserId = ID<'User'>;
export type OrganizationId = ID<'Organization'>;
export type ProjectId = ID<'Project'>;
export type TaskId = ID<'Task'>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestContext {
  requestId: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}
