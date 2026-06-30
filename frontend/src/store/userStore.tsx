import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type User = {
  id: number | null;
  name: string | null;
  role: 'organizer' | 'player' | 'admin' | null;
  email: string | null;
  mobile: string | null;
};
export const useCurrUser = create(
  persist(
    (set) => ({
      user: {
        id: '4598743',
        name: 'Prem Raj',
        role: 'organizer',
        email: 'prem.raj@example.com',
        mobile: '9876543210',
      },
      setUser: (user: User) => set({ user }),
      removeUser: () =>
        set({ user: { id: null, name: null, role: null, email: null, mobile: null } }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
