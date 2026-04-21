import React, { useState } from 'react';
import axios from 'axios';
import './AddTransaction.css';

const AddTransaction = () => {
    const [formData, setFormData] = useState({
        gardeI: '',
        demanderId: '',
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

        if (!formData.gardeI || !formData.demanderId || !formData.status) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/Transaction', formData);
            setStatus({ type: 'success', message: '✅ Transaction added successfully!' });
            setFormData({ gardeI: '', demanderId: '', status: '' });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: '', label: '-- Select Status --' },
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Approved', label: '🟢 Approved' },
        { value: 'Rejected', label: '🔴 Rejected' },
        { value: 'Completed', label: '✅ Completed' }
    ];

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    💳 <span>Add</span> Transaction
                </div>
                <p className="tagline">Transaction Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="gardeI" 
                        placeholder="🔄 Garde ID" 
                        value={formData.gardeI} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="demanderId" 
                        placeholder="👤 Requester ID" 
                        value={formData.demanderId} 
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
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;