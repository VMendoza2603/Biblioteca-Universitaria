import { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data.users || data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Usuarios registrados en el sistema</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-lg">Cargando usuarios...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
