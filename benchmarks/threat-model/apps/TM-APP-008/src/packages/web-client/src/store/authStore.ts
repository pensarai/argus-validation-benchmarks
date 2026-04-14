import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string; name: string; role: string; avatarUrl?: string | null } | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: any) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');
        const response = await apiClient.post('/api/auth/refresh', { refreshToken });
        const data = response.data.data;
        set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      },

      updateUser: (user) => {
        set({ user });
      },
    }),
    { name: 'auth-storage' }
  )
);
