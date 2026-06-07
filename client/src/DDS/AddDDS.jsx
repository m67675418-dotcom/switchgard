import React, { useState } from 'react';
import axios from 'axios';

const AddDDS = () => {
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/dds/add', formData);
      setMessage('✅ DDS created successfully!');
      setFormData({ email: '', password: '', fullName: '' });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Error creating DDS'));
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#6b21a8', marginBottom: '20px' }}>Add New DDS</h2>
      {message && <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', background: message.includes('✅') ? '#d1fae5' : '#fee2e2', color: message.includes('✅') ? '#065f46' : '#991b1b' }}>{message}</div>}
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
          <input 
            type="text" 
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <button 
          type="submit"
          style={{ width: '100%', padding: '12px', background: '#6b21a8', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          Create DDS
        </button>
      </form>
    </div>
  );
};

export default AddDDS;