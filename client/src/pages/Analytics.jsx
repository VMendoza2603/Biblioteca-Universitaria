import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

const PAGE_SIZE = 10;

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result } = await analyticsService.getSummary();
        setData(result);
      } catch (error) {
        console.error('Error al cargar analíticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-lg">Cargando analíticas...</div>;
  }

  if (!data) {
    return <div className="empty-state"><p>No hay datos disponibles</p></div>;
  }

  const { summary, avgByBook, starDistribution, topRated, worstRated, allReviews } = data;
  const maxReviews = Math.max(...Object.values(starDistribution), 1);
  const maxAvg = Math.max(...avgByBook.map(b => b.average || 0), 1);
  const totalPages = Math.ceil(allReviews.length / PAGE_SIZE);
  const paginatedReviews = allReviews.slice((reviewPage - 1) * PAGE_SIZE, reviewPage * PAGE_SIZE);

  const getBarWidth = (value, max) => Math.max((value / max) * 100, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analíticas</h1>
          <p>Panel completo de calificaciones y reseñas</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-icon warning">⭐</div>
          <div className="stat-card-info">
            <h4>Promedio general</h4>
            <span>{Number(summary.average).toFixed(1)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon success">📝</div>
          <div className="stat-card-info">
            <h4>Total reseñas</h4>
            <span>{summary.totalReviews}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon primary">📚</div>
          <div className="stat-card-info">
            <h4>Libros con reseñas</h4>
            <span>{summary.booksWithReviews}</span>
          </div>
        </div>
        {summary.avgByCategory.map(cat => (
          <div key={cat._id} className="stat-card">
            <div className="stat-card-icon warning">🏷️</div>
            <div className="stat-card-info">
              <h4>{cat.categoryName || 'Sin categoría'}</h4>
              <div>
                <span style={{ fontSize: 'var(--font-size-2xl)' }}>{Number(cat.average).toFixed(1)}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginLeft: 'var(--spacing-xs)' }}>
                  ({cat.count} reseñas)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Gráfico 1: Promedio por libro */}
        <div className="card">
          <div className="card-header">
            <h3>Promedio por libro</h3>
          </div>
          <div className="card-body bar-chart">
            {avgByBook.slice(0, 10).map(book => (
              <div key={book._id} className="bar-row">
                <span className="bar-label" title={book.title}>{book.title}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${getBarWidth(book.average, 5)}%` }}>
                    {book.average >= 3 ? Number(book.average).toFixed(1) : ''}
                  </div>
                </div>
                <span className="bar-value">{Number(book.average).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Promedio por categoría */}
        <div className="card">
          <div className="card-header">
            <h3>Promedio por categoría</h3>
          </div>
          <div className="card-body bar-chart">
            {summary.avgByCategory.map(cat => (
              <div key={cat._id} className="bar-row">
                <span className="bar-label">{cat.categoryName || 'Sin categoría'}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${getBarWidth(cat.average, 5)}%` }}>
                    {cat.average >= 3 ? Number(cat.average).toFixed(1) : ''}
                  </div>
                </div>
                <span className="bar-value">{Number(cat.average).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 3: Distribución de estrellas */}
        <div className="card">
          <div className="card-header">
            <h3>Distribución de estrellas</h3>
          </div>
          <div className="card-body">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="stars-bar-row">
                <span className="stars-label">{'★'.repeat(star)}{'☆'.repeat(5 - star)}</span>
                <div className="stars-track">
                  <div className="stars-fill" style={{ width: `${getBarWidth(starDistribution[star] || 0, maxReviews)}%` }} />
                </div>
                <span className="stars-count">{starDistribution[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 mejor calificados */}
      <div className="analytics-section">
        <h2>Top 5 libros mejor calificados</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Libro</th>
                <th>Categoría</th>
                <th>Promedio</th>
                <th>Reseñas</th>
              </tr>
            </thead>
            <tbody>
              {topRated.map(book => (
                <tr key={book._id}>
                  <td style={{ fontWeight: 500 }}>{book.title}</td>
                  <td>{book.categoryName || '-'}</td>
                  <td>
                    <span style={{ color: 'var(--color-warning)' }}>
                      {'★'.repeat(Math.round(book.average))}{'☆'.repeat(5 - Math.round(book.average))}
                    </span>
                    <span style={{ marginLeft: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                      {Number(book.average).toFixed(1)}
                    </span>
                  </td>
                  <td>{book.count}</td>
                </tr>
              ))}
              {topRated.length === 0 && (
                <tr><td colSpan={4} className="text-center" style={{ padding: 'var(--spacing-lg)', color: 'var(--text-tertiary)' }}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 peor calificados */}
      <div className="analytics-section">
        <h2>Top 5 libros peor calificados</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Libro</th>
                <th>Categoría</th>
                <th>Promedio</th>
                <th>Reseñas</th>
              </tr>
            </thead>
            <tbody>
              {worstRated.map(book => (
                <tr key={book._id}>
                  <td style={{ fontWeight: 500 }}>{book.title}</td>
                  <td>{book.categoryName || '-'}</td>
                  <td>
                    <span style={{ color: 'var(--color-warning)' }}>
                      {'★'.repeat(Math.round(book.average))}{'☆'.repeat(5 - Math.round(book.average))}
                    </span>
                    <span style={{ marginLeft: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                      {Number(book.average).toFixed(1)}
                    </span>
                  </td>
                  <td>{book.count}</td>
                </tr>
              ))}
              {worstRated.length === 0 && (
                <tr><td colSpan={4} className="text-center" style={{ padding: 'var(--spacing-lg)', color: 'var(--text-tertiary)' }}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Todas las reseñas */}
      <div className="analytics-section">
        <h2>Todas las reseñas</h2>
        <div className="card">
          {paginatedReviews.length === 0 ? (
            <div className="empty-state"><p>No hay reseñas registradas</p></div>
          ) : (
            paginatedReviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-cover">📖</div>
                <div className="review-content">
                  <h4>{review.book?.title || 'Libro'}</h4>
                  <div className="review-meta">
                    {review.user?.name} — {review.book?.category?.name || 'Sin categoría'}
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    <span style={{ color: 'var(--text-tertiary)', marginLeft: 'var(--spacing-sm)' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="review-comment">{review.comment}</p>}
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)' }}>
              <button className="btn btn-sm btn-secondary" disabled={reviewPage <= 1} onClick={() => setReviewPage(p => p - 1)}>
                Anterior
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                Página {reviewPage} de {totalPages}
              </span>
              <button className="btn btn-sm btn-secondary" disabled={reviewPage >= totalPages} onClick={() => setReviewPage(p => p + 1)}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
