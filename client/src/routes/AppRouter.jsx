import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Books from '../pages/Books';
import BookForm from '../pages/BookForm';
import Categories from '../pages/Categories';
import CategoryForm from '../pages/CategoryForm';
import Users from '../pages/Users';
import Analytics from '../pages/Analytics';
import Loans from '../pages/Loans';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-content text-center mt-lg">Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/edit/:id" element={<BookForm />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
