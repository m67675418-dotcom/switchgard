import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ManageTransactions.css';

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [formData, setFormData] = useState({
        gardeId: '',
        demanderId: '',
        status: 'en_attente'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [searchId, setSearchId] = useState('');
    
    // Modal states
    const [modal, setModal] = useState({
        show: false,
        type: '',
        title: '',
        message: '',
        details: null,
        onConfirm: null
    });

    // ✅ 1. Show status message (no dependencies)
    const showStatus = useCallback((type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }, []);

    // ✅ 2. Show/hide modal (no dependencies)
    const showModal = useCallback((config) => {
        setModal({ show: true, ...config });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, show: false }));
    }, []);

    // ✅ 3. Handle cancel - DEFINED EARLY (used by handleSubmit)
    const handleCancel = useCallback(() => {
        setSelectedTransaction(null);
        setFormData({ gardeId: '', demanderId: '', status: 'en_attente' });
        setSearchId('');
    }, []);

    // ✅ 4. Fetch transactions
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/transaction/getAll');
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            showStatus('error', 'Failed to load transactions');
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // ✅ 5. Handle search
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            showStatus('error', 'Please enter a transaction ID');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('/api/transaction/getAll');
            const found = response.data.find(t => 
                t.id === searchId.trim() || t._id === searchId.trim()
            );
            if (found) {
                handleRowClick(found);
                showStatus('success', 'Transaction found!');
            } else {
                setSelectedTransaction(null);
                showStatus('error', 'Transaction not found');
            }
        } catch (error) {
            showStatus('error', 'Search error: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [searchId, showStatus]);

    // ✅ 6. Handle row click
    const handleRowClick = useCallback((transaction) => {
        const id = transaction.id || transaction._id;
        setSearchId(id);
        setSelectedTransaction(transaction);
        setFormData({
            gardeId: transaction.gardeId || transaction.gardeI || '',
            demanderId: transaction.demanderId || '',
            status: transaction.status || 'en_attente'
        });
    }, []);

    // ✅ 7. Handle input change
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // ✅ 8. Handle delete (uses showModal, showStatus, fetchTransactions - all defined)
    const handleDelete = useCallback((transaction) => {
        const id = transaction.id || transaction._id;
        const demanderId = transaction.demanderId || 'N/A';

        showModal({
            type: 'confirmDelete',
            title: '🗑️ Confirm Delete',
            message: 'This action cannot be undone. Delete this transaction?',
            details: {
                'Transaction ID': id,
                'Demander ID': demanderId,
                'Status': transaction.status
            },
            onConfirm: async () => {
                try {
                    await axios.delete(`/deletetransaction/${id}`);
                    showStatus('success', '✅ Transaction deleted!');
                    if (selectedTransaction && (selectedTransaction.id === id || selectedTransaction._id === id)) {
                        handleCancel();
                    }
                    fetchTransactions();
                } catch (error) {
                    showStatus('error', '❌ Delete failed: ' + error.message);
                }
            }
        });
    }, [selectedTransaction, showModal, showStatus, fetchTransactions, handleCancel]);

    // ✅ 9. Handle submit - NOW handleCancel is already defined!
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedTransaction) {
            showStatus('error', 'Please select a transaction first');
            return;
        }

        showModal({
            type: 'confirmUpdate',
            title: '✏️ Confirm Update',
            message: 'Update this transaction?',
            details: {
                'Transaction ID': selectedTransaction.id || selectedTransaction._id,
                'New Status': formData.status,
                'Demander ID': formData.demanderId
            },
            onConfirm: async () => {
                setLoading(true);
                try {
                    const transactionId = selectedTransaction.id || selectedTransaction._id;
                    await axios.put(`/updateTransaction/${transactionId}`, formData, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    showStatus('success', `✅ Transaction ${transactionId} updated!`);
                    fetchTransactions();
                    handleCancel(); // ✅ Now this works!
                } catch (error) {
                    showStatus('error', 'Update failed: ' + error.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedTransaction, formData, showModal, showStatus, fetchTransactions, handleCancel]);

    // ✅ 10. Helper: Get status class
    const getStatusClass = (status) => {
        if (!status) return 'pending';
        const s = status.toLowerCase().trim();
        const map = {
            'en_attente': 'en_attente', 'pending': 'pending',
            'accepté': 'accepté', 'acceptee': 'accepté', 'approved': 'approved',
            'refusé': 'refusé', 'rejected': 'rejected',
            'terminé': 'terminé', 'completed': 'completed',
            'cancelled': 'cancelled'
        };
        return map[s] || 'pending';
    };

    const statusOptions = [
        { value: 'en_attente', label: '⏳ Pending' },
        { value: 'accepté', label: '✅ Approved' },
        { value: 'refusé', label: '❌ Rejected' },
        { value: 'terminé', label: '🎯 Completed' }
    ];

    const getTransactionId = (t) => t.id || t._id || `TRX-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="manage-page">
            <div className="manage-card">
                <h2 className="logo-text">💳 Manage<span>Transactions</span></h2>
                <p className="tagline">Hospital Management System</p>

                {status.message && (
                    <div className={`status-message ${status.type}`}>{status.message}</div>
                )}

                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by Transaction ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button type="submit" className="search-btn" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="table-wrapper">
                    {loading && transactions.length === 0 ? (
                        <div className="loading">⏳ Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="no-data">📭 No transactions found</div>
                    ) : (
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Garde ID</th>
                                    <th>Demander ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => {
                                    const transactionId = getTransactionId(transaction);
                                    const gardeId = transaction.gardeId || transaction.gardeI || 'N/A';
                                    const demanderId = transaction.demanderId || 'N/A';
                                    const txnStatus = transaction.status || 'N/A';
                                    const isSelected = selectedTransaction && 
                                        getTransactionId(selectedTransaction) === transactionId;

                                    return (
                                        <tr 
                                            key={transactionId}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => handleRowClick(transaction)}
                                        >
                                            <td>{String(transactionId)}</td>
                                            <td>{String(gardeId)}</td>
                                            <td>{String(demanderId)}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(txnStatus)}`}>
                                                    {txnStatus}
                                                </span>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <div className="action-buttons">
                                                    <button className="edit-btn" onClick={() => handleRowClick(transaction)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button className="delete-btn" onClick={() => handleDelete(transaction)}>
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {selectedTransaction && (
                    <>
                        <div className="divider"><span>✏️ Edit Mode</span></div>
                        <form onSubmit={handleSubmit} className="edit-form">
                            <h3>📋 Edit Transaction</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Transaction ID</label>
                                    <input type="text" value={getTransactionId(selectedTransaction)} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Garde ID *</label>
                                    <input type="text" name="gardeId" value={formData.gardeId} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Demander ID *</label>
                                    <input type="text" name="demanderId" value={formData.demanderId} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
                                <button type="submit" className="update-btn" disabled={loading}>
                                    {loading ? 'Updating...' : '💾 Update'}
                                </button>
                            </div>
                        </form>
                        <div className="warning-box">
                            <p>⚠️ Verify information before updating</p>
                            <p style={{fontSize:'12px',color:'#64748b'}}>📊 Total: <strong>{transactions.length}</strong></p>
                        </div>
                    </>
                )}

                <button className="refresh-btn" onClick={fetchTransactions}>🔄 Refresh List</button>
            </div>

            {/* Modal Dialog */}
            {modal.show && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                        <h4>{modal.title}</h4>
                        <p>{modal.message}</p>
                        {modal.details && (
                            <div className="modal-details">
                                {Object.entries(modal.details).map(([k,v]) => (
                                    <div key={k}><strong>{k}:</strong> {String(v)}</div>
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

export default ManageTransactions;