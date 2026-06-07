import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageDDS.css';

const ManageDDS = ({ onSelectDDS }) => {
  const [ddsList, setDdsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDDS();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this DDS?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/dds/${id}`);
      setDdsList(ddsList.filter(d => d._id !== id));
      alert('✅ DDS deleted successfully');
    } catch (error) {
      alert('❌ Failed to delete DDS');
    }
  };

  if (loading) return <div className="loading">⏳ Loading...</div>;

  return (
    <div className="manage-dds">
      <h2>👔 Manage DDS Directors</h2>

      {ddsList.length === 0 ? (
        <div className="empty-state">
          <span>👔</span>
          <p>No DDS directors found</p>
        </div>
      ) : (
        <div className="dds-table">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ddsList.map((dds) => (
                <tr key={dds._id}>
                  <td>{dds.fullName}</td>
                  <td>{dds.email}</td>
                  <td>{dds.position || 'Director'}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(dds._id)}
                    >
                      🗑️ Delete
                    </button>
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

export default ManageDDS;