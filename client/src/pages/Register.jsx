import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (form.name.trim().length < 3) {
    errors.name = 'Mínimo 3 caracteres';
  }
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
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirmar la contraseña es requerido';
  } else if (form.password && form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  return errors;
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const { register } = useAuth();

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
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(validation).length > 0) return;
    setServerError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="auth-card">
      <h1>Crear cuenta</h1>
      <p className="auth-subtitle">Regístrate para acceder al sistema de biblioteca</p>

      {serverError && <div className="alert alert-error" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', marginTop: 12, marginBottom: 0 }}>{serverError}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: serverError ? 12 : 28, flex: 1, overflowY: 'auto' }}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="name"
            className={`form-input${errors.name && touched.name ? ' error' : ''}`}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.name && touched.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group" style={{ marginTop: 18 }}>
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
            minLength={6}
          />
          {errors.password && touched.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group" style={{ marginTop: 18 }}>
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-input${errors.confirmPassword && touched.confirmPassword ? ' error' : ''}`}
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.confirmPassword && touched.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>
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
