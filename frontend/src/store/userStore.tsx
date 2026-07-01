import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type User = {
  id: string | null;
  email: string | null;
  username: string | null;
  displayName: string | null;
  role: 'organizer' | 'player' | null;
  emailVerified: boolean | null;
  phone: string | null;
  bio: string | null;
  country: string | null;
  status: string | null;
  settings: {
    showOnlineStatus: boolean | null;
    allowDirectMessages: boolean | null;
    showInSearch: boolean | null;
    notificationPrefs: {
      applications: boolean | null;
      messages: boolean | null;
      teams: boolean | null;
      organizations: boolean | null;
      tournaments: boolean | null;
      platform: boolean | null;
      security: boolean | null;
      verification: boolean | null;
    } | null;
  } | null;
}

const initialUser: User = {
  id: null,
  email: null,
  username: null,
  displayName: null,
  role: null,
  emailVerified: null,
  phone: null,
  bio: null,
  country: null,
  status: null,
  settings: null,
}

interface UserState {
  user: User;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useCurrUser = create<UserState>()(
  persist(
    (set) => ({
      user: initialUser,
      setUser: (user: User) => set({ user }),
      removeUser: () =>
        set({ user: initialUser }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
