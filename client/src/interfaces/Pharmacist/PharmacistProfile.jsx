import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaPills, FaEnvelope, FaPhone, FaHospital } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './PharmacistProfile.css';

const PharmacistProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="pharmacist-profile-container">
      <div className="profile-header">
        <FaArrowLeft className="icon-btn" onClick={() => navigate('/home-pharmacy')} />
        <h3>Pharmacist Profile</h3>
        <FaEdit className="icon-btn" />
      </div>

      <div className="profile-info-section">
        <div className="avatar-circle">
          <FaPills />
        </div>
        <h2 className="user-name">Ph. Karim Benali</h2>
        <p className="user-role">Clinical Pharmacist</p>
      </div>

      <div className="info-card">
        <div className="info-row">
          <FaEnvelope className="info-icon" />
          <p>karim.pharmacy@hospital.dz</p>
        </div>
        <div className="info-row">
          <FaPhone className="info-icon" />
          <p>+213 555 77 88 99</p>
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

export default PharmacistProfile;