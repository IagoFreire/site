import { Navigate } from 'react-router-dom';
import { useAuth } from '../../bolao/context/AuthContext';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="bolao-loading-screen">
        <div className="bolao-spinner" />
      </div>
    );
  }

  if (!session) return <Navigate to="/bolao-brasileiro/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/bolao-brasileiro" replace />;
  return <>{children}</>;
}
