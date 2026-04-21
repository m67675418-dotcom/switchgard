import React, { useState } from 'react';
import axios from 'axios';
import './AddNurse.css';

const AddNurse = () => {
    const [formData, setFormData] = useState({
        userId: '',
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

        if (!formData.userId || !formData.diplome || !formData.service || !formData.equipe) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/nurse', formData);
            setStatus({ type: 'success', message: '✅ Nurse added successfully!' });
            setFormData({ userId: '', diplome: '', service: '', equipe: '' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    🩺 <span>Add</span> Nurse
                </div>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="userId" 
                        placeholder="🆔 User ID" 
                        value={formData.userId} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="diplome" 
                        placeholder="🎓 Diploma/Certification" 
                        value={formData.diplome} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="service" 
                        placeholder="🏥 Service/Department" 
                        value={formData.service} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="equipe" 
                        placeholder="👥 Team/Shift" 
                        value={formData.equipe} 
                        onChange={handleChange} 
                        required 
                    />

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Nurse'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNurse;