import { useIsOrganizer } from '@/hooks/isLoggedIn';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function OrganizerRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isOrganizerStatus = useIsOrganizer();

  useEffect(() => {
    if (!isOrganizerStatus) {
      toast.error('access forbiden');
      navigate('/login');
    }
  }, [isOrganizerStatus, navigate]);

  if (!isOrganizerStatus) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
