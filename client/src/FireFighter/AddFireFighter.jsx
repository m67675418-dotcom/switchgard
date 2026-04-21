import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './AddFireFighter.css';

const AddFireFighter = () => {
    const [formData, setFormData] = useState({
        userId: '',
        matricule: '',
        grade: '',
        uniteIntervention: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    
    // Modal state
    const [modal, setModal] = useState({
        show: false,
        type: '',
        title: '',
        message: '',
        details: null,
        onConfirm: null
    });

    // ✅ Show status message
    const showStatus = useCallback((type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }, []);

    // ✅ Modal handlers
    const showModal = useCallback((config) => {
        setModal({ show: true, ...config });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, show: false }));
    }, []);

    // ✅ Handle input changes
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // ✅ Handle reset
    const handleReset = useCallback(() => {
        setFormData({
            userId: '',
            matricule: '',
            grade: '',
            uniteIntervention: ''
        });
    }, []);

    // ✅ Handle submit
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!formData.userId || !formData.matricule || !formData.grade || !formData.uniteIntervention) {
            showStatus('error', '⚠️ Please fill in all required fields');
            return;
        }

        showModal({
            type: 'confirmAdd',
            title: '🚒 Confirm Addition',
            message: 'Add this new firefighter to the system?',
            details: {
                'User ID': formData.userId,
                'Matricule': formData.matricule,
                'Grade': formData.grade,
                'Intervention Unit': formData.uniteIntervention
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    await axios.post('/api/firefighter', {
                        userId: formData.userId,
                        matricule: formData.matricule,
                        grade: formData.grade,
                        uniteIntervention: formData.uniteIntervention
                    });
                    showStatus('success', `✅ Firefighter ${formData.matricule} added successfully!`);
                    handleReset();
                } catch (error) {
                    console.error('Error adding firefighter:', error);
                    showStatus('error', '❌ Failed to add: ' + (error.response?.data || error.message));
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [formData, showStatus, handleReset, showModal]);

    // Options
    const gradeOptions = [
        { value: '', label: '-- Select Grade --' },
        { value: 'Sapeur', label: 'Sapeur' },
        { value: 'Caporal', label: 'Caporal' },
        { value: 'Sergent', label: 'Sergent' },
        { value: 'Adjudant', label: 'Adjudant' },
        { value: 'Lieutenant', label: 'Lieutenant' },
        { value: 'Capitaine', label: 'Capitaine' },
        { value: 'Commandant', label: 'Commandant' }
    ];

    const uniteOptions = [
        { value: '', label: '-- Select Unit --' },
        { value: 'Secours', label: 'Secours & Urgences' },
        { value: 'Incendie', label: 'Lutte Incendie' },
        { value: 'Risques', label: 'Risques Technologiques' },
        { value: 'SecoursRoutier', label: 'Secours Routier' },
        { value: 'Nautique', label: 'Secours Nautique' },
        { value: 'Montagne', label: 'Secours Montagne' }
    ];

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-text">
                    🚒 <span>Add</span> FireFighter
                </div>
                <p className="tagline">Emergency Response Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* User ID */}
                    <input 
                        type="text" 
                        name="userId" 
                        placeholder="🆔 User ID" 
                        value={formData.userId} 
                        onChange={handleInputChange} 
                        required 
                    />

                    {/* Matricule */}
                    <input 
                        type="text" 
                        name="matricule" 
                        placeholder="🔢 Matricule Number" 
                        value={formData.matricule} 
                        onChange={handleInputChange} 
                        required 
                    />

                    {/* Grade Select */}
                    <select 
                        name="grade" 
                        value={formData.grade} 
                        onChange={handleInputChange} 
                        required
                        className="form-select"
                    >
                        {gradeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Unit Select */}
                    <select 
                        name="uniteIntervention" 
                        value={formData.uniteIntervention} 
                        onChange={handleInputChange} 
                        required
                        className="form-select"
                    >
                        {uniteOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? '⏳ Adding...' : '✅ Add Firefighter'}
                    </button>
                </form>
            </div>

            {/* ============ MODAL DIALOG ============ */}
            {modal.show && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                        <h4>{modal.title}</h4>
                        <p>{modal.message}</p>
                        {modal.details && (
                            <div className="modal-details">
                                {Object.entries(modal.details).map(([key, value]) => (
                                    <div key={key}><strong>{key}:</strong> {String(value)}</div>
                                ))}
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
                            <button 
                                className="modal-btn confirm edit"
                                onClick={() => { closeModal(); modal.onConfirm?.(); }}
                            >
                                Confirm Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddFireFighter;