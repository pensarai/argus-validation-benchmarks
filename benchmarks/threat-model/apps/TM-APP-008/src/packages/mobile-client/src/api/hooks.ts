import { useState, useEffect, useCallback } from 'react';
import { mobileApiClient } from './client';
import { storeTokens, storeUser, clearTokens } from '../storage/tokens';
import { LoginSchema, UserUpdateSchema } from '@app/shared-types';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      LoginSchema.parse({ email, password });
      const response = await mobileApiClient.post<any>('/api/auth/login', { email, password });
      if (response.status === 200 && response.data.data) {
        await storeTokens(response.data.data.accessToken, response.data.data.refreshToken);
        await storeUser(response.data.data.user);
        return response.data.data.user;
      }
      throw new Error(response.data.error?.message || 'Login failed');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const response = await mobileApiClient.get<any>('/api/projects');
    setProjects(response.data.data?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { projects, loading, refetch: fetch };
}

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const path = projectId ? `/api/tasks/projects/${projectId}` : '/api/tasks';
    const response = await mobileApiClient.get<any>(path);
    setTasks(response.data.data?.items || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { tasks, loading, refetch: fetch };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);

  const update = useCallback(async (userId: string, data: Record<string, unknown>) => {
    setLoading(true);
    // Uses UserUpdateSchema which has z.any() on metadata
    UserUpdateSchema.parse(data);
    const response = await mobileApiClient.put<any>(`/api/users/${userId}`, data);
    setLoading(false);
    return response.data.data;
  }, []);

  return { update, loading };
}

export function useLogout() {
  return useCallback(async () => {
    await clearTokens();
  }, []);
}
