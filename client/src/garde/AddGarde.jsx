import React, { useState } from 'react';
import axios from 'axios';
import './AddGarde.css';
import '../styles/form.css';

const API_BASE = 'http://localhost:5000/api';

const AddGarde = () => {
    const [formData, setFormData] = useState({
        id: '',
        owner: '',
        dateGarde: '',
        status: 'disponible'
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

        const { owner, dateGarde } = formData;

        if (!owner || !dateGarde) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_BASE}/garde/add`, formData);
            setStatus({ type: 'success', message: '✅ Garde added successfully!' });
            setFormData({ id: '', owner: '', dateGarde: '', status: 'disponible' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add: ' + (error.response?.data?.message || error.message) });
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'disponible', label: '🟢 Disponible' },
        { value: 'occupied', label: '🔴 Occupied' },
        { value: 'completed', label: '✅ Completed' }
    ];

    return (
        <div className="login-page">
            <div className="login-card form-card">
                <div className="logo-text">📅 <span>Add</span> Garde</div>
                <p className="tagline">Shift & Schedule Management</p>

                {status.message && <div className={`status-message form-status ${status.type}`}>{status.message}</div>}

                <form onSubmit={handleSubmit}>
                    <input type="text" name="id" placeholder="🆔 Garde ID (Optional)" value={formData.id} onChange={handleChange} />
                    <input type="text" name="owner" placeholder="👤 Owner / Assigned To" value={formData.owner} onChange={handleChange} required />
                    <input type="date" name="dateGarde" value={formData.dateGarde} onChange={handleChange} required />
                    
                    <select name="status" value={formData.status} onChange={handleChange} required className="form-select">
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>

                    <button type="submit" className="main-btn form-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Garde'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGarde;