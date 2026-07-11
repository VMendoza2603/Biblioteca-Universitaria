import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await notificationService.getMyNotifications();
        setNotifications(data.notifications || []);
        setUnread(data.unread || 0);
      } catch (_) {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      try {
        await notificationService.markAsRead();
        setUnread(0);
      } catch (_) {}
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--border-radius-md)', color: 'var(--text-secondary)', transition: 'var(--transition)', cursor: 'pointer', border: 'none', background: 'none' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--background-secondary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position: 'absolute', right: 4, top: 4, background: 'var(--color-danger)', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 360, maxHeight: 420, overflowY: 'auto', backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 10000 }}>
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            Notificaciones
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              No hay notificaciones
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{n.message}</p>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
