import React, { useState } from 'react';
import './DDSProfile.css';

const DDSProfile = ({ ddsId, currentUser, onNavigate, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    position: currentUser?.position || 'Director'
  });

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser(formData);
    }
    setIsEditing(false);
    alert('✅ Profile updated!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dds-profile">
      {/* ✅ Back Button */}
      <button className="back-button" onClick={() => onNavigate?.('home')}>
        ← Back to Home
      </button>

      <div className="dds-profile-header">
        <h1>👤 DDS Profile</h1>
        <p>Manage your account</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">👔</div>
          <h2>{formData.fullName || 'DDS Director'}</h2>
          <p className="profile-role">{formData.position}</p>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Full Name</label>
            {isEditing ? (
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
            ) : (
              <div className="info-value">{formData.fullName}</div>
            )}
          </div>

          <div className="info-group">
            <label>Email</label>
            {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            ) : (
              <div className="info-value">{formData.email}</div>
            )}
          </div>

          <div className="info-group">
            <label>Position</label>
            {isEditing ? (
              <input type="text" name="position" value={formData.position} onChange={handleChange} />
            ) : (
              <div className="info-value">{formData.position}</div>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave}>✅ Save</button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>❌ Cancel</button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DDSProfile;