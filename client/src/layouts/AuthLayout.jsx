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
      <div className="auth-overlay" />
      <div className="auth-left">
        <div className="auth-left-inner">
          <svg className="auth-left-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="7" height="22" rx="1.5" fill="#6366f1" />
            <rect x="14.5" y="4" width="7" height="28" rx="1.5" fill="#818cf8" />
            <rect x="25" y="7" width="7" height="25" rx="1.5" fill="#a5b4fc" />
          </svg>
          <h1>Biblioteca Universitaria</h1>
        </div>
      </div>
      <div className="auth-right">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
