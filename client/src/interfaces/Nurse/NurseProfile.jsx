import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaUserNurse, FaEnvelope, FaPhone, FaHospital } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './NurseProfile.css';

const NurseProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="nurse-profile-container">
      <div className="profile-header">
        <FaArrowLeft className="icon-btn" onClick={() => navigate('/home-nurse')} />
        <h3>Profile</h3>
        <FaEdit className="icon-btn" />
      </div>

      <div className="profile-info-section">
        <div className="avatar-circle">
          <FaUserNurse />
        </div>
        <h2 className="user-name">Nurse Sara Aloui</h2>
        <p className="user-role">Emergency Department</p>
      </div>

      <div className="info-card">
        <div className="info-row">
          <FaEnvelope className="info-icon" />
          <p>sara.nurse@hospital.com</p>
        </div>
        <div className="info-row">
          <FaPhone className="info-icon" />
          <p>+213 555 123 456</p>
        </div>
        <div className="info-row">
          <FaHospital className="info-icon" />
          <p>Public Hospital - OEB</p>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default NurseProfile;