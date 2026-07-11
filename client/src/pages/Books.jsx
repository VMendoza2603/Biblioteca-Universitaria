import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import { loanService } from '../services/loanService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [myLoans, setMyLoans] = useState([]);

  const fetchBooks = useCallback(async () => {
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await bookService.getAll(params);
      setBooks(data.books || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar libros:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getAll();
        setCategories(data.categories || data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      loanService.getMyLoans().then(({ data }) => {
        setMyLoans(data.loans || []);
      }).catch(() => {});
    }
  }, [isAdmin]);

  const handleBorrow = async (bookId) => {
    setActionMsg('');
    try {
      await loanService.borrow(bookId);
      setActionMsg('✅ Libro solicitado en préstamo exitosamente');
      fetchBooks();
      const { data } = await loanService.getMyLoans();
      setMyLoans(data.loans || []);
    } catch (error) {
      setActionMsg('❌ ' + (error.response?.data?.message || 'Error al solicitar préstamo'));
    }
  };

  const handleReturn = async (loanId) => {
    setActionMsg('');
    try {
      await loanService.returnBook(loanId);
      setActionMsg('✅ Libro devuelto exitosamente');
      const { data } = await loanService.getMyLoans();
      setMyLoans(data.loans || []);
      fetchBooks();
    } catch (error) {
      setActionMsg('❌ ' + (error.response?.data?.message || 'Error al devolver libro'));
    }
  };

  const openReviewModal = (book) => {
    setReviewForm({ rating: 5, comment: '' });
    setReviewModal(book);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModal) return;
    try {
      await reviewService.create({ bookId: reviewModal._id, rating: reviewForm.rating, comment: reviewForm.comment });
      setActionMsg('✅ Reseña guardada correctamente');
      setReviewModal(null);
    } catch (error) {
      setActionMsg('❌ ' + (error.response?.data?.message || 'Error al enviar reseña'));
    }
  };

  const isLoanedByMe = (bookId) => {
    return myLoans.some(l => l.book?._id === bookId && l.status === 'active');
  };

  const myActiveLoan = (bookId) => {
    return myLoans.find(l => l.book?._id === bookId && l.status === 'active');
  };

  const handleDelete = async (id) => {
    try {
      await bookService.delete(id);
      setDeleteModal(null);
      setDeleteError('');
      fetchBooks();
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'No tienes permiso para eliminar libros');
    }
  };

  const openDeleteModal = (id) => {
    setDeleteError('');
    setDeleteModal(id);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Libros</h1>
          <p>Gestión del inventario de libros</p>
        </div>
        {isAdmin && <Link to="/books/new" className="btn btn-primary">+ Nuevo libro</Link>}
      </div>

      <div className="card mb-lg">
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por título, autor o ISBN y presiona Enter..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); } }}
            style={{ maxWidth: 320 }}
          />
          <button type="submit" className="btn btn-primary btn-sm" onClick={() => setPage(1)}>Buscar</button>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            style={{ maxWidth: 200 }}
          >
            <option value="">Todas las categorías</option>
            {Array.isArray(categories) && categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </form>
      </div>

      {actionMsg && <div className="alert alert-info">{actionMsg}</div>}

      {loading ? (
        <div className="text-center mt-lg">Cargando libros...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <p>No hay libros registrados</p>
          <Link to="/books/new" className="btn btn-primary">Agregar primer libro</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Categoría</th>
                <th>Disponibles</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(books) && books.map((book) => (
                <tr key={book._id}>
                  <td style={{ fontWeight: 500 }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{book.isbn}</td>
                  <td>{book.category?.name || '-'}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <span className={`badge ${book.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {book.isAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      {isAdmin ? (
                        <>
                          <Link to={`/books/edit/${book._id}`} className="btn btn-sm btn-secondary">Editar</Link>
                          <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(book._id)}>Eliminar</button>
                        </>
                      ) : (
                        <>
                          {book.isAvailable && !isLoanedByMe(book._id) && (
                            <button className="btn btn-sm btn-primary" onClick={() => handleBorrow(book._id)}>
                              Pedir prestado
                            </button>
                          )}
                          {isLoanedByMe(book._id) && (
                            <button className="btn btn-sm btn-success" onClick={() => handleReturn(myActiveLoan(book._id)?._id)}>
                              Devolver
                            </button>
                          )}
                          <button className="btn btn-sm btn-secondary" onClick={() => openReviewModal(book)}>
                            Calificar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Calificar: {reviewModal.title}</h3>
              <button className="modal-close" onClick={() => setReviewModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Puntuación</label>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-2xl)' }}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})}
                        style={{ cursor: 'pointer', fontSize: '28px', color: star <= reviewForm.rating ? 'var(--color-warning)' : 'var(--border-color)', background: 'none', border: 'none', padding: 0 }}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario (opcional)</label>
                  <textarea className="form-textarea" value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="¿Qué te pareció el libro?" maxLength={500} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Enviar reseña</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
          <button className="btn btn-sm btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
            Página {page} de {totalPages}
          </span>
          <button className="btn btn-sm btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </button>
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
              <p>¿Estás seguro de eliminar este libro? Esta acción no se puede deshacer.</p>
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

export default Books;
