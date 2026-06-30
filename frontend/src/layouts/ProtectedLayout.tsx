import { Outlet } from 'react-router-dom';
import ProtectedRoute from '@/components/custom/ProtectedRoute/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
