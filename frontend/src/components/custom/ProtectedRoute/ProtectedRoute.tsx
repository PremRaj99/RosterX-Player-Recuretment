import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useIsLoggedIn } from '@/hooks/isLoggedIn';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  // const isLoggedInStatus = useIsLoggedIn();
  const isLoggedInStatus = true;

  useEffect(() => {
    if (!isLoggedInStatus) {
      navigate('/login');
    }
  }, [isLoggedInStatus, navigate]);

  if (!isLoggedInStatus) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
