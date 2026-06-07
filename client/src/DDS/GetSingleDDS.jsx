import React from 'react';

const GetSingleDDS = ({ ddsId }) => {
  if (!ddsId) return null;
  
  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3>DDS Details</h3>
      <p>ID: {ddsId}</p>
    </div>
  );
};

export default GetSingleDDS;