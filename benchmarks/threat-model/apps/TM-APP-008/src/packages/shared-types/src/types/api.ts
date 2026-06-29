/**
 * Request and response type definitions for all API endpoints.
 * Used by both client packages and the API server for type safety.
 */

import type { UserPublic, UserSession } from './user';
import type { PaginatedResponse } from './common';

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  displayName?: string;
}

export interface RegisterResponse {
  user: UserPublic;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// User types
export interface UpdateProfileRequest {
  name?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  metadata?: unknown;
  timezone?: string;
  locale?: string;
}

export type PaginatedUsersResponse = PaginatedResponse<UserPublic>;

// Project types
export interface CreateProjectRequest {
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
}

// Task types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskStatusRequest {
  status: string;
  comment?: string;
}

// Webhook types
export interface WebhookTestRequest {
  url: string;
  payload?: {
    event: string;
    data: Record<string, unknown>;
  };
}

export interface WebhookTestResponse {
  success: boolean;
  status?: number;
  statusText?: string;
  responseBody?: string;
  headers?: Record<string, string>;
  error?: string;
}

// Admin types
export interface AdminAnalyticsResponse {
  totalUsers: number;
  activeUsers: number;
  totalOrgs: number;
  totalProjects: number;
}

export interface SystemHealthResponse {
  database: 'healthy' | 'unhealthy';
  uptime: number;
}
