import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ManageGarde.css';

const ManageGarde = () => {
    const [gardes, setGardes] = useState([]);
    const [selectedGarde, setSelectedGarde] = useState(null);
    const [formData, setFormData] = useState({
        owner: '',
        dateGarde: '',
        status: ''
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
        setSelectedGarde(null);
        setFormData({ owner: '', dateGarde: '', status: '' });
        setSearchId('');
    }, []);

    // ✅ Fetch all gardes
    const fetchGardes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/garde/getAll');
            setGardes(res.data || []);
            setLoading(false);
        } catch (err) {
            showStatus('error', 'Failed to load gardes');
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchGardes();
    }, [fetchGardes]);

    // ✅ Row click selection
    const handleRowClick = useCallback((garde) => {
        const id = garde.id || garde._id;
        setSearchId(id);
        setSelectedGarde(garde);
        setFormData({
            owner: garde.owner || '',
            dateGarde: garde.dateGarde ? garde.dateGarde.split('T')[0] : '',
            status: garde.status || ''
        });
    }, []);

    // ✅ Search by ID
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            showStatus('error', 'Please enter a Garde ID');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('/api/garde/getAll');
            const found = res.data.find(g => (g.id || g._id) === searchId.trim());
            if (found) {
                handleRowClick(found);
                showStatus('success', 'Garde found!');
            } else {
                setSelectedGarde(null);
                showStatus('error', 'Garde not found');
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
    const handleDelete = useCallback((garde) => {
        const id = garde.id || garde._id;
        showModal({
            type: 'confirmDelete',
            title: '🗑️ Confirm Delete',
            message: 'This action cannot be undone. Delete this garde?',
            details: {
                'Garde ID': id,
                'Owner': garde.owner || 'N/A',
                'Date': garde.dateGarde || 'N/A',
                'Status': garde.status || 'N/A'
            },
            onConfirm: async () => {
                try {
                    await axios.delete(`/deletegarde/${id}`);
                    showStatus('success', `✅ Garde ${id} deleted!`);
                    if (selectedGarde && (selectedGarde.id === id || selectedGarde._id === id)) {
                        handleCancel();
                    }
                    fetchGardes();
                } catch (err) {
                    showStatus('error', '❌ Delete failed: ' + err.message);
                }
            }
        });
    }, [selectedGarde, showModal, showStatus, fetchGardes, handleCancel]);

    // ✅ Update with modal
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedGarde) {
            showStatus('error', 'Please select a garde first');
            return;
        }
        showModal({
            type: 'confirmUpdate',
            title: '✏️ Confirm Update',
            message: 'Update this garde information?',
            details: {
                'Garde ID': selectedGarde.id || selectedGarde._id,
                'Owner': formData.owner,
                'Date': formData.dateGarde,
                'Status': formData.status
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    const id = selectedGarde.id || selectedGarde._id;
                    await axios.put(`/updateGard/${id}`, formData);
                    showStatus('success', `✅ Garde ${id} updated!`);
                    fetchGardes();
                    handleCancel();
                } catch (err) {
                    showStatus('error', 'Update failed: ' + err.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedGarde, formData, showModal, showStatus, fetchGardes, handleCancel]);

    // ✅ Filter for text search
    const filteredGardes = gardes.filter(g => {
        const q = searchQuery.toLowerCase();
        return (g.owner || '').toLowerCase().includes(q) ||
               (g.status || '').toLowerCase().includes(q) ||
               (g.dateGarde || '').toLowerCase().includes(q) ||
               ((g.id || g._id) || '').toLowerCase().includes(q);
    });

    // ✅ Status options
    const statusOptions = [
        { value: '', label: '-- Select Status --' },
        { value: 'Active', label: '🟢 Active' },
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Completed', label: '✅ Completed' },
        { value: 'Cancelled', label: '❌ Cancelled' }
    ];

    // ✅ Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // ✅ Status badge color
    const getStatusBadge = (status) => {
        const map = {
            'Active': { bg: '#dcfce7', color: '#16a34a', text: '🟢 Active' },
            'Pending': { bg: '#fef3c7', color: '#92400e', text: '🟡 Pending' },
            'Completed': { bg: '#dbeafe', color: '#1e40af', text: '✅ Completed' },
            'Cancelled': { bg: '#fee2e2', color: '#dc2626', text: '❌ Cancelled' }
        };
        return map[status] || { bg: '#f1f5f9', color: '#64748b', text: status || 'N/A' };
    };

    return (
        <div className="manage-page">
            <div className="manage-card">
                <div className="logo-text">📅 Manage<span>Garde</span></div>
                <p className="tagline">Shift & Schedule Management</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                {/* ID Search */}
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by Garde ID..."
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
                        placeholder="🔎 Filter by owner, status, date..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="search-btn" onClick={() => setSearchQuery('')}>
                        {searchQuery ? '🗑️ Clear' : '🔍 Filter'}
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    {loading && gardes.length === 0 ? (
                        <div className="loading">⏳ Loading gardes...</div>
                    ) : filteredGardes.length === 0 ? (
                        <div className="no-data">
                            {searchQuery ? 'No gardes match your search' : '📭 No gardes found'}
                        </div>
                    ) : (
                        <table className="gardes-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Owner</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGardes.map((garde) => {
                                    const gardeId = garde.id || garde._id;
                                    const isSelected = selectedGarde && (selectedGarde.id === gardeId || selectedGarde._id === gardeId);
                                    const badge = getStatusBadge(garde.status);
                                    
                                    return (
                                        <tr 
                                            key={gardeId}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => handleRowClick(garde)}
                                        >
                                            <td>{gardeId}</td>
                                            <td><strong>{garde.owner || 'N/A'}</strong></td>
                                            <td>{formatDate(garde.dateGarde)}</td>
                                            <td>
                                                <span className="status-badge" style={{ background: badge.bg, color: badge.color }}>
                                                    {badge.text}
                                                </span>
                                            </td>
                                            <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                <button className="action-btn edit" onClick={() => handleRowClick(garde)}>✏️ Edit</button>
                                                <button className="action-btn delete" onClick={() => handleDelete(garde)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Edit Form */}
                {selectedGarde && (
                    <div className="divider"><span>✏️ Edit Mode</span></div>
                )}

                {selectedGarde && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>📋 Edit Garde Information</h3>
                        
                        <input 
                            type="text" 
                            name="owner" 
                            placeholder="👤 Owner / Assigned To" 
                            value={formData.owner} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="date" 
                            name="dateGarde" 
                            value={formData.dateGarde} 
                            onChange={handleInputChange} 
                            required 
                        />
                        
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleInputChange} 
                            required 
                            className="form-select"
                        >
                            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>

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
                    <p style={{fontSize:'12px',color:'#64748b'}}>📊 Showing {filteredGardes.length} of {gardes.length} gardes</p>
                </div>

                <button className="refresh-btn" onClick={fetchGardes}>🔄 Refresh List</button>
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

export default ManageGarde;