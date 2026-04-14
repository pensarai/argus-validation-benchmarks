import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../adminApi';

export function useAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
    staleTime: 60000,
  });
}
