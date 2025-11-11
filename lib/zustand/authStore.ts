import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role?: 'customer' | 'admin';
}

interface DecodedToken {
  user_id?: string;
  email?: string;
  role?: string;
  exp?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  loginUser: (token: string) => void;
  loginAdmin: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      isAuthenticated: () => {
        const state = get();
        if (!state.token) return false;
        
        try {
          const decoded = jwtDecode<DecodedToken>(state.token);
          // Check if token is expired
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            get().logout();
            return false;
          }
          return true;
        } catch {
          return false;
        }
      },

      isAdmin: () => {
        const state = get();
        return state.user?.role === 'admin';
      },

      loginUser: (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            user: {
              id: decoded.user_id || '',
              email: decoded.email || '',
              role: 'customer',
            },
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      },

      loginAdmin: (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            user: {
              id: decoded.user_id || '',
              email: decoded.email || '',
              role: 'admin',
            },
          });
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      initializeAuth: () => {
        const state = get();
        if (state.token) {
          // Verify token is still valid
          try {
            const decoded = jwtDecode<DecodedToken>(state.token);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              get().logout();
            }
          } catch {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

