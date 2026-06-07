import React from 'react';

const DDSProfile = ({ ddsId, currentUser, onNavigate, onUpdateUser }) => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#6b21a8', marginBottom: '20px' }}>👤 DDS Profile</h1>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Full Name</label>
          <input 
            type="text" 
            value={currentUser?.fullName || ''} 
            readOnly
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Email</label>
          <input 
            type="email" 
            value={currentUser?.email || ''} 
            readOnly
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DDSProfile;
