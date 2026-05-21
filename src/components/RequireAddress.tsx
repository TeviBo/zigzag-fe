import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAddress({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950 text-white">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.address || !user.phone) {
    // If the user doesn't have an address or phone, force them to profile
    return <Navigate to="/profile" state={{ requireAddress: true, from: location }} replace />;
  }

  return children;
}
