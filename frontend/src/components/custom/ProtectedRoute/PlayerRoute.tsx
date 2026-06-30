import { useIsPlayer } from '@/hooks/isLoggedIn';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function PlayerRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isPlayerStatus = useIsPlayer();

  useEffect(() => {
    if (!isPlayerStatus) {
      toast.error('access forbiden');
      navigate('/login');
    }
  }, [isPlayerStatus, navigate]);

  if (!isPlayerStatus) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
