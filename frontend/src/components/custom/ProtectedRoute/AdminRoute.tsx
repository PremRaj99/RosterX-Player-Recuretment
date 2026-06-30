import { useIsAdmin } from '@/hooks/isLoggedIn';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isAdminStatus = useIsAdmin();

  useEffect(() => {
    if (!isAdminStatus) {
      toast.error('access forbiden');
      navigate('/login');
    }
  }, [isAdminStatus, navigate]);

  if (!isAdminStatus) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
