import OrganizerRoute from '@/components/custom/ProtectedRoute/OrganizerRoute';
import { Outlet } from 'react-router-dom';

export default function OrganizerLayout() {
  return (
    <OrganizerRoute>
      <Outlet />
    </OrganizerRoute>
  );
}
