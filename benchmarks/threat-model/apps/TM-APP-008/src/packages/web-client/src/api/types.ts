/**
 * Client-side API response types.
 * Mirrors @app/shared-types but adds axios-specific response wrapper types.
 */

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedApiResponse<T> {
  data: {
    items: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type UserResponse = ApiResponse<{
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  metadata: Record<string, unknown>;
}>;

export type LoginResponse = ApiResponse<{
  user: { id: string; email: string; name: string; role: string };
  accessToken: string;
  refreshToken: string;
}>;
