// FireFighterProfile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaUserNinja, FaEnvelope, FaPhone, FaFireExtinguisher } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './FireFighterProfile.css';

const FireFighterProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="ff-profile-container">
      <div className="container" style={{ padding: '20px' }}>
        
        <div className="profile-header">
          <FaArrowLeft className="icon-btn" onClick={() => navigate('/home-firefighter')} />
          <h3>Firefighter Profile</h3>
          <FaEdit className="icon-btn" />
        </div>

        <div className="profile-image-section">
          <div className="avatar-circle">
            <FaUserNinja />
          </div>
          <h2 className="user-name">Lt. Ahmed Boudiaf</h2>
          <p className="user-role">Fire & Rescue Unit</p>
        </div>

        <div className="info-card">
          <div className="info-row">
            <FaEnvelope className="info-row-icon" />
            <p>ahmed.fire@switchguard.dz</p>
          </div>
          <div className="info-row">
            <FaPhone className="info-row-icon" />
            <p>+213 555 99 88 77</p>
          </div>
          <div className="info-row">
            <FaFireExtinguisher className="info-row-icon" />
            <p>Station 01 - OEB</p>
          </div>
        </div>

      </div>
      <Navbar />
    </div>
  );
};

export default FireFighterProfile;