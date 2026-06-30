import PlayerRoute from '@/components/custom/ProtectedRoute/PlayerRoute';
import { Outlet } from 'react-router-dom';

export default function PlayerLayout() {
  return (
    <PlayerRoute>
      <Outlet />
    </PlayerRoute>
  );
}
