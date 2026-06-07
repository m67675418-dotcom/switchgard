import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageDDS = () => {
  const [ddsList, setDdsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDDS = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dds/getAll');
        setDdsList(res.data);
      } catch (error) {
        console.error('Error fetching DDS:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDDS();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this DDS?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/dds/${id}`);
      setDdsList(ddsList.filter(d => d._id !== id));
    } catch (error) {
      console.error('Error deleting DDS:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ color: '#6b21a8', marginBottom: '20px' }}>Manage DDS</h2>
      
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Full Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ddsList.map((dds) => (
              <tr key={dds._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{dds.fullName}</td>
                <td style={{ padding: '12px' }}>{dds.email}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => handleDelete(dds._id)}
                    style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDDS;