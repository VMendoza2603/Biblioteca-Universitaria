import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({ name: form.name, email: form.email, password: form.password });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="auth-card">
      <h1>Crear cuenta</h1>
      <p>Regístrate para acceder al sistema de biblioteca</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Crear cuenta
        </button>
      </form>

      <div className="auth-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </div>
    </div>
  );
};

export default Register;
