import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import Navbar from './Navbar'; 
import './ShiftsPage.css';

const ShiftsPage = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const navigate = useNavigate();
  const tabs = ['Upcoming', 'Completed', 'Canceled'];

  return (
    <div className="shifts-container">

      {/* ← button jdid */}
      <button className="btn-shifts-mgmt" onClick={() => navigate('/guards')}>
        🗓️ Shifts Management
      </button>

      <div className="tabs-header">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="shift-card">
        <div className="shift-header">
          <div className="doctor-info">
            <h4>Dr. Marcus Horizon</h4>
            <p>Chardiologist</p>
          </div>
          <div className="doctor-avatar">👨‍⚕️</div>
        </div>
        <div className="shift-details">
          <div className="detail-item"><FaCalendarAlt className="icon-blue" /> 26/06/2022</div>
          <div className="detail-item"><FaClock className="icon-blue" /> 10:30 AM</div>
          <div className="detail-item"><FaCheckCircle style={{color:'#ccc'}} /> Confirmed</div>
        </div>
        <div className="action-buttons">
          <button className="action-btn cancel">Cancel</button>
          <button className="action-btn reschedule">Reschedule</button>
        </div>
      </div>

      <Navbar /> 
    </div>
  );
};

export default ShiftsPage;