import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const BookForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  if (user?.role !== 'admin') {
    navigate('/books');
  }

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    year: new Date().getFullYear(),
    quantity: 1,
    isAvailable: true,
    image: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getAll();
        setCategories(data.categories || data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchBook = async () => {
        try {
          const { data } = await bookService.getById(id);
          setForm({
            title: data.title || '',
            author: data.author || '',
            isbn: data.isbn || '',
            category: data.category?._id || data.category || '',
            publisher: data.publisher || '',
            year: data.year || new Date().getFullYear(),
            quantity: data.quantity || 1,
            isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
            image: data.image || '',
          });
        } catch (err) {
          setError('Error al cargar el libro');
        }
      };
      fetchBook();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await bookService.update(id, form);
      } else {
        await bookService.create(form);
      }
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Editar libro' : 'Nuevo libro'}</h1>
          <p>{isEditing ? 'Modifica los datos del libro' : 'Registra un nuevo libro en el sistema'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Autor *</label>
              <input type="text" name="author" className="form-input" value={form.author} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ISBN *</label>
              <input type="text" name="isbn" className="form-input" value={form.isbn} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                <option value="">Seleccionar categoría</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Editorial</label>
              <input type="text" name="publisher" className="form-input" value={form.publisher} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Año de publicación</label>
              <input type="number" name="year" className="form-input" value={form.year} onChange={handleChange} min={1000} max={new Date().getFullYear()} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cantidad disponible</label>
              <input type="number" name="quantity" className="form-input" value={form.quantity} onChange={handleChange} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">URL de imagen (opcional)</label>
              <input type="url" name="image" className="form-input" value={form.image} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
              <span className="form-label" style={{ margin: 0 }}>Libro disponible</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar libro' : 'Crear libro'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/books')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
