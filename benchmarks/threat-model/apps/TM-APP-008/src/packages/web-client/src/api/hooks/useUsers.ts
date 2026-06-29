import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, validateUserUpdate } from '../client';
import { UserUpdateSchema } from '@app/shared-types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/users/me');
      return response.data.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/users/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: unknown }) => {

      const validation = validateUserUpdate(data);
      if (!validation.success) {
        throw new Error('Validation failed: ' + JSON.stringify(validation.error));
      }
      const response = await apiClient.put(`/api/users/${userId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async () => {
      const response = await apiClient.get(`/api/users/search?query=${encodeURIComponent(query)}`);
      return response.data.data;
    },
    enabled: query.length > 0,
  });
}
