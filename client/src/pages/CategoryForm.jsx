import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const CategoryForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  if (user?.role !== 'admin') {
    navigate('/categories');
  }

  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        try {
          const { data } = await categoryService.getById(id);
          setForm({ name: data.name || '', description: data.description || '' });
        } catch (err) {
          setError('Error al cargar la categoría');
        }
      };
      fetchCategory();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await categoryService.update(id, form);
      } else {
        await categoryService.create(form);
      }
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Editar categoría' : 'Nueva categoría'}</h1>
          <p>{isEditing ? 'Modifica los datos de la categoría' : 'Registra una nueva categoría'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear categoría'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/categories')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
