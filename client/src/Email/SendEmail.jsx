import React, { useState } from 'react';
import axios from 'axios';
import './SendEmail.css';

const SendEmail = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        text: '',
        html: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // ⚠️ Update this endpoint to match your Express router mount path
            // Example: if mounted as app.use('/api/emails', router), use '/api/emails'
            await axios.post('/api/send-email', formData);
            
            setStatus({ type: 'success', message: '✅ Email sent successfully!' });
            setFormData({ to: '', subject: '', text: '', html: '' });
        } catch (error) {
            const details = error.response?.data?.details || error.message || 'Unknown error';
            setStatus({ type: 'error', message: `❌ Failed to send email: ${details}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    📧 <span>Send</span> Email
                </div>
                <p className="tagline">Compose and dispatch your message</p>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="to" 
                        placeholder="Recipient Email" 
                        value={formData.to} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="subject" 
                        placeholder="Subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        required 
                    />
                    <textarea 
                        name="text" 
                        placeholder="Plain Text Body" 
                        value={formData.text} 
                        onChange={handleChange} 
                        rows="3"
                    />
                    <textarea 
                        name="html" 
                        placeholder="HTML Body (Optional)" 
                        value={formData.html} 
                        onChange={handleChange} 
                        rows="3"
                    />

                    {status.message && (
                        <div className={`status-message ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Sending...' : '📤 Send Email'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendEmail;