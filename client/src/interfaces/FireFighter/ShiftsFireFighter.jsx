// ShiftsFireFighter.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './ShiftsFireFighter.css';

const ShiftsFireFighter = () => {
  const navigate = useNavigate();
  const shifts = [
    { id: 1, type: 'Night Patrol', time: '20:00 - 06:00', location: 'Station 01 - OEB', status: 'Upcoming' },
    { id: 2, type: 'Emergency Drill', time: '09:00 - 12:00', location: 'Training Center', status: 'Completed' }
  ];

  return (
    <div className="shifts-ff-container">
      <header className="shifts-header">
        <button className="btn-back" onClick={() => navigate('/home-firefighter')}>
          <FaArrowLeft />
        </button>
        <h2 className="shifts-title">My Shifts</h2>
        <button className="btn-manage" onClick={() => navigate('/guards?from=firefighter')}>
          🗓️ Manage
        </button>
      </header>

      <div className="shifts-list">
        {shifts.map(shift => (
          <div key={shift.id} className={`shift-card ${shift.status === 'Upcoming' ? 'upcoming' : ''}`}>
            <div className="shift-card-header">
              <span className="shift-type">{shift.type}</span>
              <FaCalendarCheck className="shift-icon" />
            </div>
            <div className="shift-details">
              <div className="detail-item"><FaClock className="detail-icon" /><span>{shift.time}</span></div>
              <div className="detail-item"><FaMapMarkerAlt className="detail-icon" /><span>{shift.location}</span></div>
            </div>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default ShiftsFireFighter;