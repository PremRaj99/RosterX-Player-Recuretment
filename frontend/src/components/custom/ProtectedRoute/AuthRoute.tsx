import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsLoggedIn, useCurrUser } from '@/hooks/isLoggedIn';

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isLoggedInStatus = useIsLoggedIn();
  const user = useCurrUser();

  useEffect(() => {
    if (isLoggedInStatus) {
      if (user.role === 'organizer') {
        navigate('/org/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoggedInStatus, user, navigate]);

  if (isLoggedInStatus) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Already authenticated...</p>
      </div>
    );
  }

  return <>{children}</>;
}
