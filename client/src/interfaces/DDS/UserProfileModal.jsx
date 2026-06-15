// client/src/interfaces/DDS/UserProfileModal.jsx
import React, { useState, useEffect } from 'react';
import './UserProfileModal.css';

const PROF_ID = {
  doctor:      { field: 'numOrdre',    label: 'Ordre N°' },
  firefighter: { field: 'matricule',   label: 'Matricule' },
  pharmacist:  { field: 'numAgrement', label: 'N° Agrément' },
  nurse:       { field: 'userId',      label: 'ID' },
};

function useProfile(userId, role, token) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!userId || !role) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/user/profile/${userId}?role=${role}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId, role, token]);

  return { data, loading, error };
}

function ProfilePanel({ title, userId, role, token }) {
  const { data, loading, error } = useProfile(userId, role, token);

  const profId = PROF_ID[role] || { field: 'userId', label: 'ID' };

  const get = (...keys) => {
    if (!data) return '—';
    for (const k of keys) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== '') return data[k];
    }
    return '—';
  };

  const fullName = get('fullName', 'nomPharmacie');
  const profIdValue = get(profId.field);
  const emailValue = get('gmail', 'email');
  const specValue = get('specialty', 'service', 'grade');
  const locationValue = get('location', 'wilaya');

  return (
    <div className="upm-panel">
      <div className="upm-panel-title">{title}</div>
      {loading && <div className="upm-loading">Loading…</div>}
      {error && <div className="upm-loading">Failed to load profile</div>}
      {!loading && !error && (
        <>
          <div className="upm-field">
            <span className="upm-label">Full Name</span>
            <span className="upm-value">{fullName}</span>
          </div>
          <div className="upm-field">
            <span className="upm-label">{profId.label}</span>
            <span className="upm-value">{profIdValue}</span>
          </div>
          <div className="upm-field">
            <span className="upm-label">Email</span>
            <span className="upm-value">{emailValue}</span>
          </div>
          <div className="upm-field">
            <span className="upm-label">Specialty / Service / Grade</span>
            <span className="upm-value">{specValue}</span>
          </div>
          <div className="upm-field">
            <span className="upm-label">Location</span>
            <span className="upm-value">{locationValue}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function UserProfileModal({ demande, onClose, onApprove, onReject, token }) {
  if (!demande) return null;

  const handleApprove = () => {
    onApprove(demande._id);
    onClose();
  };

  const handleReject = () => {
    onReject(demande._id);
    onClose();
  };

  return (
    <div className="upm-overlay" onClick={onClose}>
      <div className="upm-modal" onClick={e => e.stopPropagation()}>
        <div className="upm-header">
          <span className="upm-title">Shift Exchange Review</span>
          <button className="upm-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="upm-panels">
          <ProfilePanel
            title="Current Owner"
            userId={demande.proprietaireId}
            role={demande.role}
            token={token}
          />
          <ProfilePanel
            title="New Owner"
            userId={demande.demandeurId}
            role={demande.role}
            token={token}
          />
        </div>

        <div className="upm-footer">
          <button className="upm-btn-reject" onClick={handleReject}>
            ❌ Reject
          </button>
          <button className="upm-btn-approve" onClick={handleApprove}>
            ✅ Approve
          </button>
        </div>
      </div>
    </div>
  );
}
