import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validate = (form) => {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = 'El correo es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Correo electrónico no válido';
  }
  if (!form.password) {
    errors.password = 'La contraseña es requerida';
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }
  return errors;
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    setTouched({ email: true, password: true });
    if (Object.keys(validation).length > 0) return;
    setServerError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-card">
      <h1>Iniciar sesión</h1>
      <p className="auth-subtitle">Ingresa tus credenciales para acceder al sistema</p>

      {serverError && <div className="alert alert-error" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', marginTop: 12, marginBottom: 0 }}>{serverError}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: serverError ? 12 : 28 }}>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className={`form-input${errors.email && touched.email ? ' error' : ''}`}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && touched.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group" style={{ marginTop: 18 }}>
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`form-input${errors.password && touched.password ? ' error' : ''}`}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.password && touched.password && <span className="form-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>
          Iniciar sesión
        </button>
      </form>

      <div className="auth-link">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </div>
  );
};

export default Login;
