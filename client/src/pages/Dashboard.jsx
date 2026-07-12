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

  const icons = {
    books: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5z"/>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M8 2v20"/><path d="M12 6h4"/><path d="M12 10h4"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    xmark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    message: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  };

  const mainCards = [
    { label: 'Total de libros', value: stats?.totalBooks || 0, icon: icons.books, color: 'primary', link: '/books' },
    { label: 'Libros disponibles', value: stats?.availableBooks || 0, icon: icons.check, color: 'success', link: '/books?available=true' },
    { label: 'No disponibles', value: stats?.unavailableBooks || 0, icon: icons.xmark, color: 'danger', link: '/books?available=false' },
    { label: 'Categorías', value: stats?.totalCategories || 0, icon: icons.tag, color: 'warning', link: '/categories' },
  ];

  if (isAdmin) {
    mainCards.push(
      { label: 'Usuarios registrados', value: stats?.totalUsers || 0, icon: icons.users, color: 'primary', link: '/users' },
      { label: 'Promedio general', value: stats?.ratings?.average ? Number(stats.ratings.average).toFixed(1) : '0', icon: icons.star, color: 'warning', link: '/analytics' },
      { label: 'Total reseñas', value: stats?.ratings?.totalReviews || 0, icon: icons.message, color: 'success', link: '/analytics' },
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
