import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsLoggedIn } from '@/hooks/isLoggedIn';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isLoggedInStatus = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedInStatus) {
      navigate('/login');
    }
  }, [isLoggedInStatus, navigate]);

  if (!isLoggedInStatus) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
