import React, { useState } from 'react';
import axios from 'axios';
import './AddNurse.css';

const API_BASE = 'http://localhost:5000/api';

const AddNurse = () => {
    const [formData, setFormData] = useState({
        userId: '',
        gmail: '',
        password: '',
        diplome: '',
        service: '',
        equipe: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const { gmail, password, diplome, service, equipe } = formData;

        if (!gmail || !password || !diplome || !service || !equipe) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_BASE}/nurse/add`, formData);
            setStatus({ type: 'success', message: '✅ Nurse added successfully!' });
            setFormData({ userId: '', gmail: '', password: '', diplome: '', service: '', equipe: '' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add: ' + (error.response?.data?.message || error.message) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">🩺 <span>Add</span> Nurse</div>
                <p className="tagline">Hospital Management System</p>

                {status.message && <div className={`status-message ${status.type}`}>{status.message}</div>}

                <form onSubmit={handleSubmit}>
                    <input type="text" name="userId" placeholder="🆔 User ID" value={formData.userId} onChange={handleChange} />
                    <input type="email" name="gmail" placeholder="📧 Email Address" value={formData.gmail} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="🔒 Password" value={formData.password} onChange={handleChange} required />
                    <select name="diplome" value={formData.diplome} onChange={handleChange} required className="form-select">
                        <option value="">🎓 -- Select Diploma --</option>
                        <option value="IDE">IDE</option>
                        <option value="ISP">ISP</option>
                    </select>
                    <input type="text" name="service" placeholder="🏥 Service/Department" value={formData.service} onChange={handleChange} required />
                    <input type="text" name="equipe" placeholder="👥 Team/Shift" value={formData.equipe} onChange={handleChange} required />

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Nurse'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNurse;