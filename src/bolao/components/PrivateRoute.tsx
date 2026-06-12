import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="bolao-loading-screen">
        <div className="bolao-spinner" />
      </div>
    );
  }

  if (!session) return <Navigate to="/bolao/login" replace />;
  return <>{children}</>;
}
