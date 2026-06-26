// client/src/interfaces/components/ManagerNotificationModal.jsx
import React, { useState, useEffect } from 'react';
import UserProfileModal from '../Manager/UserProfileModal';

const API = 'http://localhost:5000/api';

function useDemande(demandeId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!demandeId) { setLoading(false); return; }
    setLoading(true);
    fetch(`${API}/demande/${demandeId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, [demandeId]);

  return { data, loading };
}

// STATUS_OF mirrors the logic in ManagerNotifications.jsx, so a manager
// clicking a notification gets the same Approve/Reject vs read-only
// behavior whether they're in the live dropdown or the history page.
const STATUS_OF = (notif) => {
  if (notif.type === 'director_review') return notif.status || 'pending';
  if (notif.type === 'final_approved') return 'approved';
  if (notif.type === 'final_rejected' || notif.type === 'demande_rejected') return 'rejected';
  return 'pending';
};

export default function ManagerNotificationModal({ notif, currentUser, onClose, onNavigate, onDecided }) {
  const { data: demande, loading } = useDemande(notif?.demandeId);
  const token = localStorage.getItem('token');

  if (!notif) return null;
  if (loading) return null; // brief flash avoided; UserProfileModal itself shows internal loading once demande resolves
  if (!demande) return null;

  const approve = async (id) => {
    try {
      await fetch(`${API}/demande/${id}/director-approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      onDecided?.();
    } catch {}
  };

  const reject = async (id) => {
    try {
      await fetch(`${API}/demande/${id}/director-reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      onDecided?.();
    } catch {}
  };

  const handleMessage = (userId, name) => {
    onClose();
    onNavigate?.('messages', { openUserId: userId, openUserName: name });
  };

  return (
    <UserProfileModal
      demande={demande}
      token={token}
      onClose={onClose}
      onApprove={approve}
      onReject={reject}
      onMessage={handleMessage}
      readOnly={STATUS_OF(notif) !== 'pending'}
    />
  );
}