import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddGarde.css';
import '../styles/form.css';

const API_BASE = 'http://localhost:5000/api';

const AddGarde = ({ currentUser }) => {
    const ownerDefault = currentUser?.fullName || currentUser?.userId || currentUser?.matricule || currentUser?.email || '';

    const [formData, setFormData] = useState({
        id: '',
        owner: ownerDefault,
        dateGarde: '',
        status: 'disponible'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (ownerDefault) {
            setFormData(prev => ({ ...prev, owner: ownerDefault }));
        }
    }, [ownerDefault]);

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
            setStatus({ type: 'success', message: '✅ Shift added successfully!' });
            setFormData({ id: '', owner: ownerDefault, dateGarde: '', status: 'disponible' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add shift: ' + (error.response?.data?.message || error.message) });
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'disponible', label: '🟢 Available' },
        { value: 'occupied',   label: '🔴 Occupied' },
        { value: 'completed',  label: '✅ Completed' }
    ];

    return (
        <div className="login-page">
            <div className="login-card form-card">
                <div className="logo-text">📅 <span>Add</span> Shift</div>
                <p className="tagline">Staff Shift Management</p>

                {status.message && <div className={`status-message form-status ${status.type}`}>{status.message}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="id"
                        placeholder="🆔 Shift ID (Optional)"
                        value={formData.id}
                        onChange={handleChange}
                        className="form-field"
                    />
                    <input
                        type="text"
                        name="owner"
                        placeholder="👤 Assigned To"
                        value={formData.owner}
                        onChange={handleChange}
                        required
                        className="form-field"
                    />
                    <input
                        type="date"
                        name="dateGarde"
                        value={formData.dateGarde}
                        onChange={handleChange}
                        required
                        className="form-field"
                    />

                    <select name="status" value={formData.status} onChange={handleChange} required className="form-field">
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>

                    <button type="submit" className="main-btn form-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Shift'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGarde;
