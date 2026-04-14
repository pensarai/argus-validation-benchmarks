import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../adminApi';

export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'system-health'],
    queryFn: () => adminApi.getSystemHealth(),
    refetchInterval: 30000,
  });
}
