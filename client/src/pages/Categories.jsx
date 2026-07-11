import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data.categories || data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setDeleteModal(null);
      setDeleteError('');
      fetchCategories();
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'No tienes permiso para eliminar categorías');
    }
  };

  const openDeleteModal = (id) => {
    setDeleteError('');
    setDeleteModal(id);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categorías</h1>
          <p>Gestión de categorías de libros</p>
        </div>
        {isAdmin && <Link to="/categories/new" className="btn btn-primary">+ Nueva categoría</Link>}
      </div>

      {loading ? (
        <div className="text-center mt-lg">Cargando categorías...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <p>No hay categorías registradas</p>
          <Link to="/categories/new" className="btn btn-primary">Crear primera categoría</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(categories) && categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 500 }}>{cat.name}</td>
                  <td>{cat.description || '-'}</td>
                  <td>
                    {isAdmin && (
                      <div className="actions">
                        <Link to={`/categories/edit/${cat._id}`} className="btn btn-sm btn-secondary">Editar</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(cat._id)}>Eliminar</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
              <button className="modal-close" onClick={() => setDeleteModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {deleteError && <div className="alert alert-error">{deleteError}</div>}
              <p>¿Estás seguro de eliminar esta categoría?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteModal)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
