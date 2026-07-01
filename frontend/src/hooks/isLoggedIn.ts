import { useCurrUser as useUser, type User } from '@/store/userStore';

const emptyUser: User = {
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
};

export const useCurrUser = (): User => {
  const user = useUser((state: unknown) => (state as { user?: User }).user);
  return user ?? emptyUser;
};

export const useIsLoggedIn = () => {
  const user = useCurrUser();
  return !!user?.id;
};

export const useIsOrganizer = () => {
  const user = useCurrUser();
  return user?.role === 'organizer';
};

export const useIsPlayer = () => {
  const user = useCurrUser();
  return user?.role === 'player';
};

export const useIsAdmin = () => {
  const user = useCurrUser();
  return user?.role === 'organizer' || user?.role === 'player'; // Or if user.role is admin, since role can be 'organizer' | 'player' | null
};
