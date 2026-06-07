import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DDSGarde = ({ currentUser, onNavigate }) => {
  const [gardes, setGardes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGardes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/garde/getAll');
        setGardes(res.data);
      } catch (error) {
        console.error('Error fetching gardes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGardes();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#6b21a8', marginBottom: '20px' }}>🛡️ All Gardes</h1>
      
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Owner</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Archived</th>
            </tr>
          </thead>
          <tbody>
            {gardes.map((garde) => (
              <tr key={garde._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{garde.owner || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{new Date(garde.dateGarde).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    background: garde.status === 'Active' ? '#10b981' : '#64748b',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {garde.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{garde.archived ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DDSGarde;