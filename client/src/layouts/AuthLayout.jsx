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
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block' }}>
            <rect x="4" y="8" width="8" height="28" rx="1" fill="#4f46e5" />
            <rect x="16" y="4" width="8" height="32" rx="1" fill="#6366f1" />
            <rect x="28" y="6" width="8" height="30" rx="1" fill="#818cf8" />
            <rect x="4" y="32" width="32" height="5" rx="2" fill="#e2e8f0" opacity="0.3" />
          </svg>
          <h1>Biblioteca Universitaria</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
