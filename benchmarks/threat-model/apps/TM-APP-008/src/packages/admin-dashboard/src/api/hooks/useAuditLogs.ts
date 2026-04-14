import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../adminApi';

export function useAuditLogs(filters?: { limit?: number; offset?: number; action?: string; userId?: string }) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: () => adminApi.getAuditLogs(filters),
  });
}
