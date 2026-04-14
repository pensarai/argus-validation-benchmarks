import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { TaskCreateSchema, TaskStatusChangeSchema } from '@app/shared-types';

interface TaskFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export function useTasks(projectId: string, filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.priority) params.set('priority', filters.priority);
      if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId);
      if (filters?.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
      if (filters?.dueDateTo) params.set('dueDateTo', filters.dueDateTo);

      const response = await apiClient.get(`/api/tasks/projects/${projectId}?${params.toString()}`);
      return response.data.data;
    },
    enabled: !!projectId,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/tasks/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; projectId: string; description?: string; priority?: string; assigneeId?: string }) => {
      TaskCreateSchema.parse(data);
      const response = await apiClient.post(`/api/tasks/projects/${data.projectId}`, data);
      return response.data.data;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await apiClient.put(`/api/tasks/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, comment }: { id: string; status: string; comment?: string }) => {
      TaskStatusChangeSchema.parse({ status, comment });
      const response = await apiClient.patch(`/api/tasks/${id}/status`, { status, comment });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      const response = await apiClient.post(`/api/tasks/${taskId}/comments`, { content, taskId });
      return response.data.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
}
