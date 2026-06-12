import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DDSGarde.css';

const DDSGarde = ({ currentUser, onNavigate }) => {
  const [gardes, setGardes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGardes();
  }, []);

  const fetchGardes = async () => {
    try {
      const role = currentUser?.managerType;
      const url = role
        ? `http://localhost:5000/api/garde/getAll?role=${role}`
        : 'http://localhost:5000/api/garde/getAll';
      const res = await axios.get(url);
      setGardes(res.data);
    } catch (error) {
      console.error('Error fetching gardes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGardes = filter === 'all'
    ? gardes
    : gardes.filter(g => g.status.toLowerCase() === filter);

  const fmt = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return d; }
  };

  return (
    <div className="mg-garde">
      <button className="mg-back-button" onClick={() => onNavigate?.('home')}>
        ← Back to Home
      </button>

      <div className="mg-garde-header">
        <h1>🛡️ All Gardes</h1>
        <p>Manage all guard shifts</p>
      </div>

      <div className="mg-filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All ({gardes.length})
        </button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
          Active ({gardes.filter(g => g.status === 'Active').length})
        </button>
      </div>

      {loading ? (
        <div className="mg-loading">⏳ Loading...</div>
      ) : filteredGardes.length === 0 ? (
        <div className="mg-empty-state">
          <span>📋</span>
          <p>No gardes found</p>
        </div>
      ) : (
        <div className="mg-gardes-table-container">
          <table className="mg-gardes-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Date</th>
                <th>Status</th>
                <th>Archived</th>
              </tr>
            </thead>
            <tbody>
              {filteredGardes.map((garde) => (
                <tr key={garde._id}>
                  <td>{garde.owner || 'N/A'}</td>
                  <td>{fmt(garde.dateGarde)}</td>
                  <td>
                    <span className={`mg-status-badge ${garde.status.toLowerCase()}`}>
                      {garde.status}
                    </span>
                  </td>
                  <td>{garde.archived ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DDSGarde;
