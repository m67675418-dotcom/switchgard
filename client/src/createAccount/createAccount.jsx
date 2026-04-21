import React, { useState } from 'react';
import axios from 'axios';
import './createAccount.css';

const CreateAccount = () => {
    const [step, setStep] = useState(1);
    const [accountCode, setAccountCode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // ✅ Handle code validation (Step 1)
    const handleValidateCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        if (!accountCode.trim()) {
            setStatus({ type: 'error', message: '⚠️ Please enter the account code' });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/createAccount/validate-code', { accountCode });
            if (res.data.success) {
                setStatus({ type: 'success', message: '✅ Code validated! Continue to registration' });
                setTimeout(() => setStep(2), 1500);
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || '❌ Invalid code' 
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle form input changes (Step 2)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Handle account creation (Step 2)
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            setStatus({ type: 'error', message: '⚠️ Please fill in all required fields' });
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: '⚠️ Passwords do not match' });
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setStatus({ type: 'error', message: '⚠️ Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/createAccount/create', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            if (res.data.success) {
                setStatus({ type: 'success', message: `✅ ${formData.role} account created! Redirecting...` });
                // Redirect after success (adjust URL as needed)
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || '❌ Failed to create account' 
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Role options
    const roleOptions = [
        { value: '', label: '-- Select Role --' },
        { value: 'Doctor', label: '👨‍⚕️ Doctor' },
        { value: 'Nurse', label: '🩺 Nurse' },
        { value: 'Pharmacist', label: '💊 Pharmacist' }
    ];

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Progress Indicator */}
                <div className="progress-bar">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Validate Code</span>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Create Account</span>
                    </div>
                </div>

                <div className="logo-text">
                    🏥 <span>Create</span> Account
                </div>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                {/* STEP 1: Validate Code */}
                {step === 1 && (
                    <form onSubmit={handleValidateCode}>
                        <input 
                            type="text" 
                            placeholder="🔑 Enter Account Code" 
                            value={accountCode}
                            onChange={(e) => setAccountCode(e.target.value)}
                            required
                            className="code-input"
                        />
                        <button type="submit" className="main-btn" disabled={loading}>
                            {loading ? '⏳ Validating...' : '✅ Validate Code'}
                        </button>
                    </form>
                )}

                {/* STEP 2: Create Account */}
                {step === 2 && (
                    <form onSubmit={handleCreateAccount}>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="👤 Full Name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="📧 Email Address" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="🔒 Password (min. 6 chars)" 
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength="6"
                        />
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="🔐 Confirm Password" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className="form-select"
                        >
                            {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ⬅️ Back
                            </button>
                            <button type="submit" className="main-btn" disabled={loading}>
                                {loading ? '⏳ Creating...' : '🚀 Create Account'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateAccount;