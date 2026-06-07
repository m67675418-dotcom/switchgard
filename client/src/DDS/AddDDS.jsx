import React, { useState } from 'react';
import axios from 'axios';
import './AddDDS.css';

const AddDDS = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    position: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/account/register', {
        email: formData.email,
        password: formData.password,
        role: 'dds',
        fullName: formData.fullName,
        position: formData.position || 'Director'
      });

      setMessage('✅ DDS created successfully!');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        position: ''
      });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Error creating DDS'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-dds">
      <h2>👔 Add New DDS Director</h2>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dds-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Director of Health"
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Minimum 6 characters"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter password"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? '⏳ Creating...' : '✅ Create DDS Account'}
        </button>
      </form>
    </div>
  );
};

export default AddDDS;