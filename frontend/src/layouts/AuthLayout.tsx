import AuthRoute from '@/components/custom/ProtectedRoute/AuthRoute';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <AuthRoute>
      <div className="mx-auto w-full max-w-xl">
        <Outlet />
      </div>
    </AuthRoute>
  );
}
