import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Employee } from '../types';

interface AuthState {
  user: User | null;
  employee: Employee | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, employee: Employee | null, token: string, refreshToken: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      employee: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, employee, token, refreshToken) =>
        set({
          user,
          employee,
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          user: null,
          employee: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);