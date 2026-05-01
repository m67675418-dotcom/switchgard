// GuardPageFireFighter.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaCheckCircle, FaUserNinja, FaTrash, FaPlus } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './GuardPageFireFighter.css';

const GuardPageFireFighter = () => {
    const [shifts, setShifts] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    // Theme Color
    const themeColor = '#ef4444';

    const tabs = ['Upcoming', 'Completed', 'Canceled'];

    // Dummy Data (Connect with API later)
    useEffect(() => {
        setShifts([
            { _id: 1, owner: 'Lt. Ahmed', dateGarde: '2026-04-28', status: 'Upcoming', location: 'Station 01' },
            { _id: 2, owner: 'Sgt. Khalid', dateGarde: '2026-04-27', status: 'Completed', location: 'Zone A' }
        ]);
    }, []);

    const handleAdd = () => { setShowForm(!showForm); };
    const deleteShift = (id) => { setShifts(shifts.filter(s => s._id !== id)); };

    const filteredShifts = shifts.filter(s => s.status === activeTab);

    return (
        <div className="guard-ff-container">
            <header className="guard-header">
                <button className="btn-back" onClick={() => navigate(-1)} style={{ color: themeColor, borderColor: themeColor }}>
                    <FaArrowLeft />
                </button>
                <h2 className="guard-title"> Firefighter Shifts</h2>
                <button className="btn-add" style={{ background: themeColor }} onClick={handleAdd}>
                    {showForm ? '✕ Cancel' : <><FaPlus /> Add Shift</>}
                </button>
            </header>

            {showForm && (
                <div className="shift-form">
                    <h3 className="form-title" style={{ color: themeColor }}>Add New Shift</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>Firefighter Name</label><input type="text" placeholder="Name..." /></div>
                        <div className="form-group"><label>Date</label><input type="date" /></div>
                        <div className="form-group"><label>Location</label><input type="text" placeholder="Station..." /></div>
                        <div className="form-group"><label>Status</label>
                            <select><option>Upcoming</option><option>Completed</option></select>
                        </div>
                    </div>
                    <button className="btn-save" style={{ background: themeColor }} onClick={handleAdd}>💾 Save</button>
                </div>
            )}

            <div className="shifts-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`shift-tab-btn ${activeTab === tab ? 'active' : ''}`}
                        style={activeTab === tab ? { background: themeColor, color: '#fff' } : {}}
                        onClick={() => setActiveTab(tab)}
                    >{tab}</button>
                ))}
            </div>

            <div className="shifts-list">
                {filteredShifts.length === 0 ? (
                    <div className="shifts-empty"><FaCalendarAlt size={40} color="#cbd5e1" /><p>No shifts</p></div>
                ) : (
                    filteredShifts.map(shift => (
                        <div className="shift-card" key={shift._id}>
                            <div className="shift-card-header">
                                <div>
                                    <h4 className="shift-owner" style={{ color: themeColor }}>{shift.owner}</h4>
                                    <p className="shift-location">{shift.location}</p>
                                </div>
                                <div className="shift-avatar" style={{ background: themeColor + '20' }}>
                                    <FaUserNinja size={26} color={themeColor} />
                                </div>
                            </div>
                            <div className="shift-card-details">
                                <div className="detail-item"><FaCalendarAlt className="detail-icon" style={{ color: themeColor }} /><span>{shift.dateGarde}</span></div>
                                <div className="detail-item"><FaCheckCircle className="detail-icon" style={{ color: shift.status === 'Completed' ? '#10b981' : '#ccc' }} /><span>{shift.status}</span></div>
                            </div>
                            <div className="shift-card-actions">
                                <button className="btn-delete" onClick={() => deleteShift(shift._id)}><FaTrash /> Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Navbar />
        </div>
    );
};

export default GuardPageFireFighter;