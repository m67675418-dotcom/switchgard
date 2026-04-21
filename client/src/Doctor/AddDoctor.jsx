import React, { useState } from 'react';
import axios from 'axios';
import './AddDoctor.css';

const AddDoctor = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        specialty: '',
        numOrdre: '',
        location: '',
        isAvailable: true
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        if (!formData.fullName || !formData.email || !formData.specialty || !formData.numOrdre || !formData.location) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/Doctors', formData);
            setStatus({ type: 'success', message: '✅ Doctor added successfully!' });
            setFormData({
                fullName: '',
                email: '',
                specialty: '',
                numOrdre: '',
                location: '',
                isAvailable: true
            });
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Failed to add: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const specialtyOptions = [
        { value: '', label: '-- Select Specialty --' },
        { value: 'Cardiology', label: '❤️ Cardiology' },
        { value: 'Pediatrics', label: '👶 Pediatrics' },
        { value: 'Dermatology', label: '🧴 Dermatology' },
        { value: 'Orthopedics', label: '🦴 Orthopedics' },
        { value: 'Neurology', label: '🧠 Neurology' },
        { value: 'General Practice', label: '🩺 General Practice' },
        { value: 'Surgery', label: '🔪 Surgery' },
        { value: 'Psychiatry', label: '🧘 Psychiatry' }
    ];

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    👨‍⚕️ <span>Add</span> Doctor
                </div>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="👤 Full Name (Dr. ...)" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="📧 Email Address" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                    <select 
                        name="specialty" 
                        value={formData.specialty} 
                        onChange={handleChange} 
                        required 
                        className="form-select"
                    >
                        {specialtyOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <input 
                        type="text" 
                        name="numOrdre" 
                        placeholder="🔢 Order Number" 
                        value={formData.numOrdre} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="location" 
                        placeholder="🏥 Clinic/Hospital Location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                    />
                    
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="isAvailable" 
                            checked={formData.isAvailable} 
                            onChange={handleChange} 
                        />
                        <span>✅ Available for Appointments</span>
                    </label>

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Processing...' : '➕ Add Doctor'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;