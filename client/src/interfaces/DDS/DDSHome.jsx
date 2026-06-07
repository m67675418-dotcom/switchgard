import React from 'react';

const DDSHome = ({ currentUser, onNavigate }) => {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#6b21a8', marginBottom: '20px' }}>👔 DDS Dashboard</h1>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '30px' }}>
        Welcome {currentUser?.fullName || 'Director'}
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        <div 
          onClick={() => onNavigate('demandes')}
          style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', border: '2px solid #e2e8f0' }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
          <h3 style={{ margin: '0 0 8px', color: '#6b21a8' }}>Pending Requests</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Review and approve garde exchanges</p>
        </div>

        <div 
          onClick={() => onNavigate('garde')}
          style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', border: '2px solid #e2e8f0' }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ margin: '0 0 8px', color: '#6b21a8' }}>All Gardes</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>View all gardes in the system</p>
        </div>

        <div 
          onClick={() => onNavigate('messages')}
          style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', border: '2px solid #e2e8f0' }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
          <h3 style={{ margin: '0 0 8px', color: '#6b21a8' }}>Messages</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Communicate with staff</p>
        </div>
      </div>
    </div>
  );
};

export default DDSHome;