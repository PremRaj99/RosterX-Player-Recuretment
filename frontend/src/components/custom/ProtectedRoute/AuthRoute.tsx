import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useIsLoggedIn } from '@/hooks/isLoggedIn';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  // const isLoggedInStatus = useIsLoggedIn();
  const isLoggedInStatus = false;

  useEffect(() => {
    if (isLoggedInStatus) {
      navigate('/');
    }
  }, [isLoggedInStatus, navigate]);

  if (isLoggedInStatus) {
    return <p>Already authenticated...</p>;
  }

  return <>{children}</>;
}
