import { useState, useEffect } from 'react';
import { loanService } from '../services/loanService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

const Loans = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyModal, setNotifyModal] = useState(null);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const { data } = isAdmin ? await loanService.getAll() : await loanService.getMyLoans();
        setLoans(data.loans || data);
      } catch (err) {
        console.error('Error al cargar préstamos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [isAdmin]);

  const handleSendNotice = async (loan) => {
    try {
      await notificationService.create({
        userId: loan.user._id,
        loanId: loan._id,
        message: notifyMsg,
      });
      setActionMsg(`Aviso enviado a ${loan.user.name}`);
      setNotifyModal(null);
      setNotifyMsg('');
    } catch (err) {
      setActionMsg('Error al enviar aviso');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Préstamos</h1>
          <p>{isAdmin ? 'Gestión de préstamos de libros' : 'Mis préstamos'}</p>
        </div>
      </div>

      {actionMsg && <div className="alert alert-info">{actionMsg}</div>}

      {loading ? (
        <div className="text-center mt-lg">Cargando préstamos...</div>
      ) : loans.length === 0 ? (
        <div className="empty-state"><p>No hay préstamos registrados</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>Usuario</th>}
                <th>Libro</th>
                <th>Fecha préstamo</th>
                <th>Fecha devolución</th>
                <th>Estado</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  {isAdmin && <td style={{ fontWeight: 500 }}>{loan.user?.name || '—'}</td>}
                  <td>{loan.book?.title || '—'}</td>
                  <td>{formatDate(loan.loanDate)}</td>
                  <td>{formatDate(loan.returnDate)}</td>
                  <td>
                    <span className={`badge ${loan.status === 'active' ? 'badge-warning' : 'badge-success'}`}
                      style={loan.status === 'active' ? { backgroundColor: '#fffbeb', color: '#92400e' } : {}}>
                      {loan.status === 'active' ? 'Activo' : 'Devuelto'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => setNotifyModal(loan)}>
                        Enviar aviso
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notifyModal && (
        <div className="modal-overlay" onClick={() => setNotifyModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enviar aviso a {notifyModal.user?.name}</h3>
              <button className="modal-close" onClick={() => setNotifyModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                Libro: <strong>{notifyModal.book?.title}</strong>
              </p>
              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea className="form-textarea" value={notifyMsg}
                  onChange={(e) => setNotifyMsg(e.target.value)}
                  placeholder="Ej: Tu préstamo ha vencido, por favor devuelve el libro..."
                  maxLength={500} rows={4} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setNotifyModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => handleSendNotice(notifyModal)} disabled={!notifyMsg.trim()}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
