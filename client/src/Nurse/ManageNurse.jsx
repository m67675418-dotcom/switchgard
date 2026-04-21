import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ManageNurse.css';

const ManageNurse = () => {
    const [nurses, setNurses] = useState([]);
    const [selectedNurse, setSelectedNurse] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        diplome: '',
        service: '',
        equipe: ''
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
        setSelectedNurse(null);
        setFormData({ userId: '', diplome: '', service: '', equipe: '' });
        setSearchId('');
    }, []);

    // ✅ Fetch all nurses
    const fetchNurses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/Nurse/getAll');
            setNurses(res.data || []);
            setLoading(false);
        } catch (err) {
            showStatus('error', 'Failed to load nurses');
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchNurses();
    }, [fetchNurses]);

    // ✅ Row click selection
    const handleRowClick = useCallback((nurse) => {
        const id = nurse.id || nurse._id;
        setSearchId(id);
        setSelectedNurse(nurse);
        setFormData({
            userId: nurse.userId || '',
            diplome: nurse.diplome || '',
            service: nurse.service || '',
            equipe: nurse.equipe || ''
        });
    }, []);

    // ✅ Search by ID
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            showStatus('error', 'Please enter a Nurse ID');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('/api/Nurse/getAll');
            const found = res.data.find(n => (n.id || n._id) === searchId.trim());
            if (found) {
                handleRowClick(found);
                showStatus('success', 'Nurse found!');
            } else {
                setSelectedNurse(null);
                showStatus('error', 'Nurse not found');
            }
        } catch (err) {
            showStatus('error', 'Search error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [searchId, showStatus, handleRowClick]);

    // ✅ Input change
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // ✅ Delete with modal
    const handleDelete = useCallback((nurse) => {
        const id = nurse.id || nurse._id;
        showModal({
            type: 'confirmDelete',
            title: '🗑️ Confirm Delete',
            message: 'This action cannot be undone. Delete this nurse?',
            details: {
                'Nurse ID': id,
                'User ID': nurse.userId || 'N/A',
                'Diploma': nurse.diplome || 'N/A',
                'Service': nurse.service || 'N/A'
            },
            onConfirm: async () => {
                try {
                    await axios.delete(`/deleteNurse/${id}`);
                    showStatus('success', `✅ Nurse ${id} deleted!`);
                    if (selectedNurse && (selectedNurse.id === id || selectedNurse._id === id)) {
                        handleCancel();
                    }
                    fetchNurses();
                } catch (err) {
                    showStatus('error', '❌ Delete failed: ' + err.message);
                }
            }
        });
    }, [selectedNurse, showModal, showStatus, fetchNurses, handleCancel]);

    // ✅ Update with modal
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedNurse) {
            showStatus('error', 'Please select a nurse first');
            return;
        }
        showModal({
            type: 'confirmUpdate',
            title: '✏️ Confirm Update',
            message: 'Update this nurse information?',
            details: {
                'Nurse ID': selectedNurse.id || selectedNurse._id,
                'User ID': formData.userId,
                'Service': formData.service,
                'Team': formData.equipe
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    const id = selectedNurse.id || selectedNurse._id;
                    await axios.put(`/updateNurse/${id}`, formData);
                    showStatus('success', `✅ Nurse ${id} updated!`);
                    fetchNurses();
                    handleCancel();
                } catch (err) {
                    showStatus('error', 'Update failed: ' + err.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedNurse, formData, showModal, showStatus, fetchNurses, handleCancel]);

    // ✅ Filter for text search
    const filteredNurses = nurses.filter(nurse => {
        const q = searchQuery.toLowerCase();
        return (nurse.userId || '').toLowerCase().includes(q) ||
               (nurse.diplome || '').toLowerCase().includes(q) ||
               (nurse.service || '').toLowerCase().includes(q) ||
               (nurse.equipe || '').toLowerCase().includes(q) ||
               ((nurse.id || nurse._id) || '').toLowerCase().includes(q);
    });

    return (
        <div className="manage-page">
            <div className="manage-card">
                <div className="logo-text">🩺 Manage<span>Nurse</span></div>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                {/* ID Search */}
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by Nurse ID..."
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
                        placeholder="🔎 Filter by user, diploma, service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="search-btn" onClick={() => setSearchQuery('')}>
                        {searchQuery ? '🗑️ Clear' : '🔍 Filter'}
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    {loading && nurses.length === 0 ? (
                        <div className="loading">⏳ Loading nurses...</div>
                    ) : filteredNurses.length === 0 ? (
                        <div className="no-data">
                            {searchQuery ? 'No nurses match your search' : '📭 No nurses found'}
                        </div>
                    ) : (
                        <table className="nurses-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>Diploma</th>
                                    <th>Service</th>
                                    <th>Team</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNurses.map((nurse) => {
                                    const nurseId = nurse.id || nurse._id;
                                    const isSelected = selectedNurse && (selectedNurse.id === nurseId || selectedNurse._id === nurseId);
                                    
                                    return (
                                        <tr 
                                            key={nurseId}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => handleRowClick(nurse)}
                                        >
                                            <td>{nurseId}</td>
                                            <td><strong>{nurse.userId || 'N/A'}</strong></td>
                                            <td><span className="badge diploma">{nurse.diplome || 'N/A'}</span></td>
                                            <td><span className="badge service">{nurse.service || 'N/A'}</span></td>
                                            <td><span className="badge equipe">{nurse.equipe || 'N/A'}</span></td>
                                            <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                <button className="action-btn edit" onClick={() => handleRowClick(nurse)}>✏️ Edit</button>
                                                <button className="action-btn delete" onClick={() => handleDelete(nurse)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Edit Form */}
                {selectedNurse && (
                    <div className="divider"><span>✏️ Edit Mode</span></div>
                )}

                {selectedNurse && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>📋 Edit Nurse Information</h3>
                        
                        <input 
                            type="text" 
                            name="userId" 
                            placeholder="🆔 User ID" 
                            value={formData.userId} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="text" 
                            name="diplome" 
                            placeholder="🎓 Diploma/Certification" 
                            value={formData.diplome} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="text" 
                            name="service" 
                            placeholder="🏥 Service/Department" 
                            value={formData.service} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="text" 
                            name="equipe" 
                            placeholder="👥 Team/Shift" 
                            value={formData.equipe} 
                            onChange={handleInputChange} 
                            required 
                        />

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
                    <p style={{fontSize:'12px',color:'#64748b'}}>📊 Showing {filteredNurses.length} of {nurses.length} nurses</p>
                </div>

                <button className="refresh-btn" onClick={fetchNurses}>🔄 Refresh List</button>
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

export default ManageNurse;