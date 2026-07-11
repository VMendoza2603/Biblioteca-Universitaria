import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
