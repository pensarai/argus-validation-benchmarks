import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  currentUser: { id: string; email: string; name: string; role: string } | any;
  accessToken: string | null;
  selectedOrganization: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  setOrganization: (orgId: string | null) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      currentUser: null,
      accessToken: null,
      selectedOrganization: null,

      login: (token, user) => set({ accessToken: token, currentUser: user }),
      logout: () => set({ accessToken: null, currentUser: null, selectedOrganization: null }),
      setOrganization: (orgId) => set({ selectedOrganization: orgId }),
    }),
    { name: 'admin-storage' }
  )
);
