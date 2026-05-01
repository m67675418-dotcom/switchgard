import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck, FaClock } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './ShiftsPharmacist.css';

const ShiftsPharmacist = () => {
  const navigate = useNavigate();

  return (
    <div className="shifts-pharmacy-container">
      <header className="shifts-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/home-pharmacy')} />
        <h2 className="header-title">My Shifts</h2>
        <button className="btn-manage" onClick={() => navigate('/guard-page-pharmacy')}>
          Manage
        </button>
      </header>

      <div className="shift-card">
        <div className="shift-header-row">
          <span className="shift-type">Night Duty</span>
          <FaCalendarCheck className="shift-icon" />
        </div>
        <div className="shift-details">
          <div className="detail-item"><FaClock className="detail-icon" /> 20:00 - 08:00</div>
          <div className="detail-text">الصيدلية المركزية - الطابق الأرضي</div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default ShiftsPharmacist;