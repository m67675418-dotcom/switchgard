import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck, FaClock } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './ShiftsNurse.css';

const ShiftsNurse = () => {
  const navigate = useNavigate();

  return (
    <div className="shifts-nurse-container">
      <header className="shifts-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/home-nurse')} />
        <h2 className="header-title">My Shifts</h2>
        <button className="btn-manage" onClick={() => navigate('/guard-page-nurse')}>
          Manage
        </button>
      </header>

      <div className="shifts-list">
        <div className="shift-card">
          <div className="shift-header-row">
            <span className="shift-type">Night Shift</span>
            <FaCalendarCheck className="shift-icon" />
          </div>
          <div className="shift-details">
            <div className="detail-item"><FaClock className="detail-icon" /> 20:00 - 08:00</div>
            <div className="detail-text">قسم الاستعجالات - الطابق الأول</div>
          </div>
        </div>
        
        <div className="shift-card completed">
          <div className="shift-header-row">
            <span className="shift-type">Morning Shift</span>
            <FaCalendarCheck className="shift-icon" />
          </div>
          <div className="shift-details">
            <div className="detail-item"><FaClock className="detail-icon" /> 08:00 - 14:00</div>
            <div className="detail-text">قسم الأطفال</div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default ShiftsNurse;