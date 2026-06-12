// client/src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

export default function Sidebar({ items, activeView, onNavigate, onLogout }) {
  return (
    <div className="sb-sidebar">
      <div className="sb-logo">🏥</div>
      {items.map(({ view, icon }) => (
        <button
          key={view}
          className={`sb-btn ${activeView === view ? 'sb-active' : ''}`}
          onClick={() => onNavigate(view)}
          title={view}
        >
          {icon}
        </button>
      ))}
      <div className="sb-spacer" />
      <button className="sb-btn" onClick={() => onNavigate('profile')} title="Profile">👤</button>
      <button className="sb-btn" onClick={onLogout} title="Logout">🚪</button>
    </div>
  );
}
