import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const defaultRoles = [
  { id: 'user', name: 'User', permissions: ['read:own', 'write:own'] },
  { id: 'admin', name: 'Admin', permissions: ['read:all', 'write:all', 'manage:users'] },
  { id: 'superadmin', name: 'Super Admin', permissions: ['*'] },
];

export function useRoles() {
  return useQuery({ queryKey: ['admin', 'roles'], queryFn: async () => defaultRoles });
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => ({ roleId, permissions }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'roles'] }),
  });
}
