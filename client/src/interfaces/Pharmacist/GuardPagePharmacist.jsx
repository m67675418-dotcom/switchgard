import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaPills, FaPlus, FaTrash } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './GuardPagePharmacist.css';

const GuardPagePharmacist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');

  const shifts = [
    { id: 1, owner: 'Ph. Sara Messaoudi', date: '2026-04-28', status: 'Upcoming' },
    { id: 2, owner: 'Ph. Youcef Hadj', date: '2026-04-27', status: 'Completed' },
  ];

  return (
    <div className="guard-pharmacy-container">
      <header className="guard-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/shifts-pharmacy')} />
        <h2 className="header-title">Shifts Management</h2>
        <div className="btn-add"><FaPlus /> Add</div>
      </header>

      <div className="tabs-container">
        {['Upcoming', 'Completed', 'Canceled'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="shifts-list">
        {shifts.map(shift => (
          <div key={shift.id} className="shift-card">
            <div className="shift-card-header">
              <div className="owner-info">
                <h4>{shift.owner}</h4>
                <p>{shift.date}</p>
              </div>
              <div className="shift-avatar"><FaPills /></div>
            </div>
            <div className="shift-card-footer">
              <span className={`status-badge ${shift.status.toLowerCase()}`}>{shift.status}</span>
              <FaTrash className="delete-icon" />
            </div>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
};

export default GuardPagePharmacist;
