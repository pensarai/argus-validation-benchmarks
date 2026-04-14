import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import { useAuthStore } from '../../store/authStore';
import { LoginSchema, RegisterSchema } from '@app/shared-types';

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      LoginSchema.parse(data);
      const response = await apiClient.post('/api/auth/login', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string; displayName?: string }) => {
      RegisterSchema.parse(data);
      const response = await apiClient.post('/api/auth/register', data);
      return response.data.data;
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      return response.data.data;
    },
  });
}
