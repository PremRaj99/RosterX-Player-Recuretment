import { useCurrUser as useUser, type User } from '@/store/userStore';

const emptyUser: User = {
  id: null,
  name: null,
  role: null,
  email: null,
  mobile: null,
};

export const useCurrUser = (): User => {
  // useCurrUser may accept a selector; keep selector typed loosely to avoid runtime issues
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
  return user?.role === 'admin';
};
