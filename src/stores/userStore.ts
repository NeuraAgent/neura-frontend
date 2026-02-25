import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  available_file_ids?: string[];

  setUser: (user: User | null) => void;

  getFileIds: () => string[];
  setFileIds: (file_ids: string[]) => void;

  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setFileIds: (file_ids: string[]) => {
        set({ available_file_ids: file_ids });
      },
      getFileIds: () => get().available_file_ids ?? [],

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist user and auth status, not loading state
    }
  )
);
