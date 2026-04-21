import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ManageMessage.css';

const ManageMessage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [formData, setFormData] = useState({
        senderId: '',
        receiverId: '',
        content: '',
        timestamp: '',
        isRead: false
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
        setSelectedMessage(null);
        setFormData({ senderId: '', receiverId: '', content: '', timestamp: '', isRead: false });
        setSearchId('');
    }, []);

    // ✅ Fetch all messages
    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/message/getAll');
            setMessages(res.data || []);
            setLoading(false);
        } catch (err) {
            showStatus('error', 'Failed to load messages');
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // ✅ Row click selection
    const handleRowClick = useCallback((msg) => {
        const id = msg.id || msg._id;
        setSearchId(id);
        setSelectedMessage(msg);
        setFormData({
            senderId: msg.senderId || '',
            receiverId: msg.receiverId || '',
            content: msg.content || '',
            timestamp: msg.timestamp ? msg.timestamp.split('T')[0] + 'T' + msg.timestamp.split('T')[1]?.slice(0, 5) : '',
            isRead: msg.isRead || false
        });
    }, []);

    // ✅ Search by ID
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            showStatus('error', 'Please enter a Message ID');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('/api/message/getAll');
            const found = res.data.find(m => (m.id || m._id) === searchId.trim());
            if (found) {
                handleRowClick(found);
                showStatus('success', 'Message found!');
            } else {
                setSelectedMessage(null);
                showStatus('error', 'Message not found');
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
    const handleDelete = useCallback((msg) => {
        const id = msg.id || msg._id;
        showModal({
            type: 'confirmDelete',
            title: '🗑️ Confirm Delete',
            message: 'This action cannot be undone. Delete this message?',
            details: {
                'Message ID': id,
                'From': msg.senderId || 'N/A',
                'To': msg.receiverId || 'N/A',
                'Content': msg.content?.slice(0, 50) + (msg.content?.length > 50 ? '...' : '') || 'N/A'
            },
            onConfirm: async () => {
                try {
                    await axios.delete(`/deletemessage/${id}`);
                    showStatus('success', `✅ Message ${id} deleted!`);
                    if (selectedMessage && (selectedMessage.id === id || selectedMessage._id === id)) {
                        handleCancel();
                    }
                    fetchMessages();
                } catch (err) {
                    showStatus('error', '❌ Delete failed: ' + err.message);
                }
            }
        });
    }, [selectedMessage, showModal, showStatus, fetchMessages, handleCancel]);

    // ✅ Update with modal
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedMessage) {
            showStatus('error', 'Please select a message first');
            return;
        }
        showModal({
            type: 'confirmUpdate',
            title: '✏️ Confirm Update',
            message: 'Update this message information?',
            details: {
                'Message ID': selectedMessage.id || selectedMessage._id,
                'From': formData.senderId,
                'To': formData.receiverId,
                'Read': formData.isRead ? '✅ Yes' : '❌ No'
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    const id = selectedMessage.id || selectedMessage._id;
                    await axios.put(`/updateMessage/${id}`, formData);
                    showStatus('success', `✅ Message ${id} updated!`);
                    fetchMessages();
                    handleCancel();
                } catch (err) {
                    showStatus('error', 'Update failed: ' + err.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedMessage, formData, showModal, showStatus, fetchMessages, handleCancel]);

    // ✅ Filter for text search
    const filteredMessages = messages.filter(msg => {
        const q = searchQuery.toLowerCase();
        return (msg.senderId || '').toLowerCase().includes(q) ||
               (msg.receiverId || '').toLowerCase().includes(q) ||
               (msg.content || '').toLowerCase().includes(q) ||
               ((msg.id || msg._id) || '').toLowerCase().includes(q);
    });

    // ✅ Format timestamp for display
    const formatTimestamp = (ts) => {
        if (!ts) return 'N/A';
        return new Date(ts).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // ✅ Truncate content for table
    const truncateContent = (content, max = 40) => {
        if (!content) return 'N/A';
        return content.length > max ? content.slice(0, max) + '...' : content;
    };

    return (
        <div className="manage-page">
            <div className="manage-card">
                <div className="logo-text">💬 Manage<span>Message</span></div>
                <p className="tagline">Internal Messaging System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                {/* ID Search */}
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by Message ID..."
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
                        placeholder="🔎 Filter by sender, receiver, content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" className="search-btn" onClick={() => setSearchQuery('')}>
                        {searchQuery ? '🗑️ Clear' : '🔍 Filter'}
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    {loading && messages.length === 0 ? (
                        <div className="loading">⏳ Loading messages...</div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="no-data">
                            {searchQuery ? 'No messages match your search' : '📭 No messages found'}
                        </div>
                    ) : (
                        <table className="messages-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>From → To</th>
                                    <th>Content</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.map((msg) => {
                                    const msgId = msg.id || msg._id;
                                    const isSelected = selectedMessage && (selectedMessage.id === msgId || selectedMessage._id === msgId);
                                    
                                    return (
                                        <tr 
                                            key={msgId}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => handleRowClick(msg)}
                                        >
                                            <td>{msgId}</td>
                                            <td>
                                                <small><strong>{msg.senderId || 'N/A'}</strong></small>
                                                <br />
                                                <small>→ {msg.receiverId || 'N/A'}</small>
                                            </td>
                                            <td><span className="content-cell">{truncateContent(msg.content)}</span></td>
                                            <td><small>{formatTimestamp(msg.timestamp)}</small></td>
                                            <td>
                                                <span className={`status-badge ${msg.isRead ? 'read' : 'unread'}`}>
                                                    {msg.isRead ? '✅ Read' : '📬 Unread'}
                                                </span>
                                            </td>
                                            <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                                <button className="action-btn edit" onClick={() => handleRowClick(msg)}>✏️ Edit</button>
                                                <button className="action-btn delete" onClick={() => handleDelete(msg)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Edit Form */}
                {selectedMessage && (
                    <div className="divider"><span>✏️ Edit Mode</span></div>
                )}

                {selectedMessage && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>📋 Edit Message Information</h3>
                        
                        <input 
                            type="text" 
                            name="senderId" 
                            placeholder="👤 Sender ID" 
                            value={formData.senderId} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <input 
                            type="text" 
                            name="receiverId" 
                            placeholder="🎯 Receiver ID" 
                            value={formData.receiverId} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <textarea 
                            name="content" 
                            placeholder="✍️ Message content..." 
                            value={formData.content} 
                            onChange={handleInputChange} 
                            required 
                            rows="3"
                            className="form-textarea"
                        />
                        <input 
                            type="datetime-local" 
                            name="timestamp" 
                            value={formData.timestamp} 
                            onChange={handleInputChange} 
                            className="form-datetime"
                        />
                        
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="isRead" 
                                checked={formData.isRead} 
                                onChange={handleInputChange} 
                            />
                            <span>👁️ Mark as Read</span>
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
                    <p style={{fontSize:'12px',color:'#64748b'}}>📊 Showing {filteredMessages.length} of {messages.length} messages</p>
                </div>

                <button className="refresh-btn" onClick={fetchMessages}>🔄 Refresh List</button>
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

export default ManageMessage;