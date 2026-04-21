import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ManageDoctor.css';

const ManageDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
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
    const [searchId, setSearchId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [modal, setModal] = useState({
        show: false,
        type: '',
        title: '',
        message: '',
        details: null,
        onConfirm: null
    });

    // ✅ Status message
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

    // ✅ Cancel / Reset
    const handleCancel = useCallback(() => {
        setSelectedDoctor(null);
        setFormData({ fullName: '', email: '', specialty: '', numOrdre: '', location: '', isAvailable: true });
        setSearchId('');
    }, []);

    // ✅ Fetch all doctors
    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/Doctor/getAll');
            setDoctors(res.data || []);
            setLoading(false);
        } catch (err) {
            showStatus('error', 'Failed to load doctors');
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // ✅ Row click selection
    const handleRowClick = useCallback((doctor) => {
        const id = doctor.id || doctor._id;
        setSearchId(id);
        setSelectedDoctor(doctor);
        setFormData({
            fullName: doctor.fullName || '',
            email: doctor.email || '',
            specialty: doctor.specialty || '',
            numOrdre: doctor.numOrdre || '',
            location: doctor.location || '',
            isAvailable: doctor.isAvailable ?? true
        });
    }, []);

    // ✅ Search by ID
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            showStatus('error', 'Please enter a Doctor ID');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('/api/Doctor/getAll');
            const found = res.data.find(d => (d.id || d._id) === searchId.trim());
            if (found) {
                handleRowClick(found);
                showStatus('success', 'Doctor found!');
            } else {
                setSelectedDoctor(null);
                showStatus('error', 'Doctor not found');
            }
        } catch (err) {
            showStatus('error', 'Search error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [searchId, showStatus, handleRowClick]);

    // ✅ Input change
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    // ✅ Delete with modal
    const handleDelete = useCallback((doctor) => {
        const id = doctor.id || doctor._id;
        showModal({
            type: 'confirmDelete',
            title: '🗑️ Confirm Delete',
            message: 'This action cannot be undone. Delete this doctor?',
            details: {
                'Doctor ID': id,
                'Name': doctor.fullName || 'N/A',
                'Specialty': doctor.specialty || 'N/A',
                'Email': doctor.email || 'N/A',
                'Status': doctor.isAvailable ? '✅ Available' : '❌ Busy'
            },
            onConfirm: async () => {
                try {
                    await axios.delete(`/DeleteDoctor/${id}`);
                    showStatus('success', `✅ Doctor ${id} deleted!`);
                    if (selectedDoctor && (selectedDoctor.id === id || selectedDoctor._id === id)) {
                        handleCancel();
                    }
                    fetchDoctors();
                } catch (err) {
                    showStatus('error', '❌ Delete failed: ' + err.message);
                }
            }
        });
    }, [selectedDoctor, showModal, showStatus, fetchDoctors, handleCancel]);

    // ✅ Update with modal
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedDoctor) {
            showStatus('error', 'Please select a doctor first');
            return;
        }
        showModal({
            type: 'confirmUpdate',
            title: '✏️ Confirm Update',
            message: 'Update this doctor information?',
            details: {
                'Doctor ID': selectedDoctor.id || selectedDoctor._id,
                'Name': formData.fullName,
                'Specialty': formData.specialty,
                'Status': formData.isAvailable ? '✅ Available' : '❌ Busy'
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    const id = selectedDoctor.id || selectedDoctor._id;
                    await axios.put(`/updateDoctor/${id}`, formData);
                    showStatus('success', `✅ Doctor ${id} updated!`);
                    fetchDoctors();
                    handleCancel();
                } catch (err) {
                    showStatus('error', 'Update failed: ' + err.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedDoctor, formData, showModal, showStatus, fetchDoctors, handleCancel]);

    // ✅ Filter for text search
    const filteredDoctors = doctors.filter(doctor => {
        const q = searchQuery.toLowerCase();
        return (doctor.fullName || '').toLowerCase().includes(q) ||
               (doctor.email || '').toLowerCase().includes(q) ||
               (doctor.specialty || '').toLowerCase().includes(q) ||
               (doctor.numOrdre || '').toLowerCase().includes(q) ||
               (doctor.location || '').toLowerCase().includes(q) ||
               ((doctor.id || doctor._id) || '').toLowerCase().includes(q);
    });

    // ✅ Specialty emoji helper
    const getSpecialtyEmoji = (specialty) => {
        const map = {
            'Cardiology': '❤️',
            'Pediatrics': '👶',
            'Dermatology': '🧴',
            'Orthopedics': '🦴',
            'Neurology': '🧠',
            'General Practice': '🩺',
            'Surgery': '🔪',
            'Psychiatry': '🧘'
        };
        return map[specialty] || '👨‍⚕️';
    };

    // ✅ Truncate location for table
    const truncateLocation = (location, max = 25) => {
        if (!location) return 'N/A';
        return location.length > max ? location.slice(0, max) + '...' : location;
    };

    // ✅ Specialty options for edit form
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
        <div className="manage-page">
            <div className="manage-card">
                <div className="logo-text">👨‍⚕️ Manage<span>Doctor</span></div>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                {/* ID Search */}
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by Doctor ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button type="submit" className="search-btn" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Text Filter */}
                <div className="search-box" style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔎 Filter by name, specialty, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="search-btn" onClick={() => setSearchQuery('')}>
                        {searchQuery ? '🗑️ Clear' : '🔍 Filter'}
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    {loading && doctors.length === 0 ? (
                        <div className="loading">⏳ Loading doctors...</div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="no-data">
                            {searchQuery ? 'No doctors match your search' : '📭 No doctors found'}
                        </div>
                    ) : (
                        <table className="doctors-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Specialty</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.map((doctor) => {
                                    const doctorId = doctor.id || doctor._id;
                                    const isSelected = selectedDoctor && (selectedDoctor.id === doctorId || selectedDoctor._id === doctorId);
                                    
                                    return (
                                        <tr 
                                            key={doctorId}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => handleRowClick(doctor)}
                                        >
                                            <td>{doctorId}</td>
                                            <td>
                                                <strong>{doctor.fullName || 'N/A'}</strong>
                                                <br />
                                                <small className="text-muted">#{doctor.numOrdre || 'N/A'}</small>
                                            </td>
                                            <td>
                                                <span className="badge specialty">
                                                    {getSpecialtyEmoji(doctor.specialty)} {doctor.specialty || 'N/A'}
                                                </span>
                                            </td>
                                            <td><span className="location-cell">{truncateLocation(doctor.location)}</span></td>
                                            <td>
                                                <span className={`status-badge ${doctor.isAvailable ? 'available' : 'busy'}`}>
                                                    {doctor.isAvailable ? '✅ Available' : '❌ Busy'}
                                                </span>
                                            </td>
                                            <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                <button className="action-btn edit" onClick={() => handleRowClick(doctor)}>✏️ Edit</button>
                                                <button className="action-btn delete" onClick={() => handleDelete(doctor)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Edit Form */}
                {selectedDoctor && (
                    <div className="divider"><span>✏️ Edit Mode</span></div>
                )}

                {selectedDoctor && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>📋 Edit Doctor Information</h3>
                        
                        <input 
                            type="text" 
                            name="fullName" 
                            placeholder="👤 Full Name (Dr. ...)" 
                            value={formData.fullName} 
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
                        <select 
                            name="specialty" 
                            value={formData.specialty} 
                            onChange={handleInputChange} 
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
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="text" 
                            name="location" 
                            placeholder="🏥 Clinic/Hospital Location" 
                            value={formData.location} 
                            onChange={handleInputChange} 
                            required 
                        />
                        
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="isAvailable" 
                                checked={formData.isAvailable} 
                                onChange={handleInputChange} 
                            />
                            <span>✅ Available for Appointments</span>
                        </label>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
                            <button type="submit" className="main-btn" disabled={loading}>
                                {loading ? '⏳ Updating...' : '💾 Update'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="warning-box">
                    <p>⚠️ Verify information accuracy before updating</p>
                    <p style={{fontSize:'12px',color:'#64748b'}}>📊 Showing {filteredDoctors.length} of {doctors.length} doctors</p>
                </div>

                <button className="refresh-btn" onClick={fetchDoctors}>🔄 Refresh List</button>
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
                                className={`modal-btn confirm ${modal.type === 'confirmUpdate' ? 'edit' : ''}`}
                                onClick={() => { closeModal(); modal.onConfirm?.(); }}
                            >
                                {modal.type === 'confirmDelete' ? '🗑️ Delete' : '✅ Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDoctor;