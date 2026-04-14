import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../adminApi';

export function useAdminUsers(params?: { limit?: number; offset?: number }) {
  return useQuery({ queryKey: ['admin', 'users', params], queryFn: () => adminApi.getUsers(params) });
}

export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ userId, role }: { userId: string; role: string }) => adminApi.changeUserRole(userId, role), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) });
}

export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ userId, active }: { userId: string; active: boolean }) => adminApi.toggleUserStatus(userId, active), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (userId: string) => adminApi.toggleUserStatus(userId, false), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) });
}
