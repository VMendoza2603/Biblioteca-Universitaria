import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-lg">Cargando estadísticas...</div>;
  }

  const mainCards = [
    { label: 'Total de libros', value: stats?.totalBooks || 0, icon: '📚', color: 'primary', link: '/books' },
    { label: 'Libros disponibles', value: stats?.availableBooks || 0, icon: '✅', color: 'success', link: '/books' },
    { label: 'No disponibles', value: stats?.unavailableBooks || 0, icon: '❌', color: 'danger', link: '/books' },
    { label: 'Categorías', value: stats?.totalCategories || 0, icon: '🏷️', color: 'warning', link: '/categories' },
  ];

  if (isAdmin) {
    mainCards.push(
      { label: 'Usuarios registrados', value: stats?.totalUsers || 0, icon: '👥', color: 'primary', link: '/users' },
      { label: 'Promedio general', value: stats?.ratings?.average ? Number(stats.ratings.average).toFixed(1) : '0', icon: '⭐', color: 'warning', link: '/analytics' },
      { label: 'Total reseñas', value: stats?.ratings?.totalReviews || 0, icon: '📝', color: 'success', link: '/analytics' },
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>{isAdmin ? 'Panel de administración del sistema' : 'Panel de usuario'}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {mainCards.map((card) => (
          <Link key={card.label} to={card.link || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="stat-card" style={{ cursor: card.link ? 'pointer' : 'default' }}>
              <div className={`stat-card-icon ${card.color}`}>
                {card.icon}
              </div>
              <div className="stat-card-info">
                <h4>{card.label}</h4>
                <span>{card.value}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isAdmin && stats?.recentReviews?.length > 0 && (
        <div className="card mt-lg">
          <div className="card-header">
            <h3>Últimas reseñas</h3>
            <Link to="/analytics" className="btn btn-sm btn-primary">Ver todas</Link>
          </div>
          <div className="card-body">
            {stats.recentReviews.map((review) => (
              <div key={review._id} style={{ display: 'flex', gap: 'var(--spacing-md)', padding: 'var(--spacing-md) 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'center', minWidth: 48 }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {Number(review.rating).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', marginTop: 2 }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
                    {review.user?.name} — <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{review.book?.title}</span>
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
                      {review.comment.length > 100 ? review.comment.slice(0, 100) + '...' : review.comment}
                    </p>
                  )}
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdmin && (
        <>
          {stats?.myLoans?.length > 0 && (
            <div className="card mt-lg">
              <div className="card-header">
                <h3>Mis préstamos activos</h3>
              </div>
              <div className="card-body">
                {stats.myLoans.filter(l => l.status === 'active').map(loan => (
                  <div key={loan._id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>📖</span>
                    <span style={{ fontWeight: 500 }}>{loan.book?.title || 'Libro'}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats?.myReviews?.length > 0 && (
            <div className="card mt-lg">
              <div className="card-header">
                <h3>Mis reseñas</h3>
              </div>
              <div className="card-body">
                {stats.myReviews.map(review => (
                  <div key={review._id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>📝</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>{review.book?.title || 'Libro'}</span>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
