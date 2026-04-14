import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminClient } from '../client';

export function useAllOrganizations() {
  return useQuery({
    queryKey: ['admin', 'organizations'],
    queryFn: async () => {
      const res = await adminClient.get('/api/organizations');
      return res.data.data;
    },
  });
}

export function useSuspendOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orgId, suspended }: { orgId: string; suspended: boolean }) => {
      const res = await adminClient.put(`/api/organizations/${orgId}`, { settings: { suspended } });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'organizations'] }),
  });
}

export function useOrganizationStats() {
  return useQuery({
    queryKey: ['admin', 'org-stats'],
    queryFn: async () => {
      const res = await adminClient.get('/api/admin/analytics');
      return res.data.data;
    },
  });
}
