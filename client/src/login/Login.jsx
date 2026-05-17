import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png'; // ✅ اللوغو
import './Login.css';

const API_BASE = 'http://localhost:5000/api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const roles = [
    { id: 'doctor',      label: 'Doctor',      emoji: '👨‍⚕️' },
    { id: 'nurse',       label: 'Nurse',       emoji: '👩‍⚕️' },
    { id: 'pharmacist',  label: 'Pharmacist',  emoji: '💊'  },
    { id: 'firefighter', label: 'Firefighter', emoji: '🚒'  },
    { id: 'admin',       label: 'Admin',       emoji: '🛡️'  },
  ];

  const handleChange     = (e)      => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (roleId) => {
    setFormData({ ...formData, role: formData.role === roleId ? '' : roleId });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) { setError('⚠️ Please enter email and password'); return; }
    if (!formData.role)                         { setError('⚠️ Please select your role');         return; }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Sending login request...', formData);

      const response = await axios.post(`${API_BASE}/account/login`, {
        email:    formData.email,
        password: formData.password,
        role:     formData.role,
      });

      console.log('📥 Response:', response.data);

      if (response.data.success || response.data.token) {
        const userData = response.data.user || response.data.userData;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ Login successful!', userData);
        if (onLoginSuccess) onLoginSuccess(userData);

        const role = userData?.role || formData.role;
        switch (role) {
          case 'admin':       navigate('/admin/dashboard');       break;
          case 'doctor':      navigate('/doctor/dashboard');      break;
          case 'nurse':       navigate('/nurse/dashboard');       break;
          case 'pharmacist':  navigate('/pharmacist/dashboard');  break;
          case 'firefighter': navigate('/firefighter/dashboard'); break;
          default:            navigate('/dashboard');             break;
        }
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      const status  = err?.response?.status;
      const message = err?.response?.data?.message || '';

      if (status === 403) {
        const match       = message.match(/'([^']+)'/);
        const actualRole  = match ? match[1] : '';
        setError(`❌ Wrong role! This account is registered as "${actualRole}"`);
      } else if (status === 401) {
        setError('❌ Invalid email or password');
      } else if (status === 400) {
        setError('⚠️ Please fill all fields');
      } else {
        setError('❌ Server error, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-container">
          {/* ✅ اللوغو بدل الـ emoji */}
          <img src={logo} alt="SwitchGard Logo" className="login-logo" />
          <p className="tagline">Let's get started!</p>
        </div>

        {error && <div className="status-message error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input type="email"    name="email"    placeholder="📧 Email"    value={formData.email}    onChange={handleChange} required />
          <input type="password" name="password" placeholder="🔐 Password" value={formData.password} onChange={handleChange} required />

          <div className="role-section">
            <p className="role-title">🎯 Select your role:</p>
            <div className="role-checkboxes-grid">
              {roles.map(role => (
                <label
                  key={role.id}
                  className={`role-checkbox-item ${formData.role === role.id ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.role === role.id}
                    onChange={() => handleRoleChange(role.id)}
                  />
                  <span className="role-checkbox-label">
                    <span className="role-emoji">{role.emoji}</span>
                    <span>{role.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="main-btn" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/signup" className="signup-link">
            📝 Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;