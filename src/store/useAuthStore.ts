import { create } from 'zustand';

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  photoUrl?: string;
  isPremium: boolean;
  trustLevel?: number;
};

type AuthState = {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));
