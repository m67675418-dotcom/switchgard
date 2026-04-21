import React, { useState } from 'react';
import axios from 'axios';
import './AddGarde.css';

const AddGarde = () => {
    const [formData, setFormData] = useState({
        id: '',
        owner: '',
        dateGarde: '',
        status: ''
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

        if (!formData.id || !formData.owner || !formData.dateGarde || !formData.status) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/Garde', formData);
            setStatus({ type: 'success', message: '✅ Garde added successfully!' });
            setFormData({ id: '', owner: '', dateGarde: '', status: '' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add Garde: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    📅 <span>Add</span> Garde
                </div>
                <p className="tagline">Shift & Schedule Management</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="id" 
                        placeholder="🆔 Garde ID" 
                        value={formData.id} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="owner" 
                        placeholder="👤 Owner / Assigned To" 
                        value={formData.owner} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="date" 
                        name="dateGarde" 
                        value={formData.dateGarde} 
                        onChange={handleChange} 
                        required 
                    />
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        required 
                        className="form-select"
                    >
                        <option value="">-- Select Status --</option>
                        <option value="Active">🟢 Active</option>
                        <option value="Pending">🟡 Pending</option>
                        <option value="Completed">✅ Completed</option>
                        <option value="Cancelled">❌ Cancelled</option>
                    </select>

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Garde'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGarde;