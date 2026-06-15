import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationBell.css';

const NotificationBell = ({ currentUser, onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const userId = currentUser._id || currentUser.id;
      const res = await axios.get(`http://localhost:5000/api/notification/user/${userId}`);
      setNotifications(res.data || []);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notification/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = currentUser._id || currentUser.id;
      await axios.put(`http://localhost:5000/api/notification/user/${userId}/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAcceptDemande = async (demandeId, e) => {
    e.stopPropagation();
    if (!window.confirm('✅ Accepter cette demande?')) return;

    try {
      await axios.put(`http://localhost:5000/api/demande/${demandeId}/accept`);
      alert('✅ Demande acceptée! Vous pouvez maintenant discuter.');
      fetchNotifications();
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectDemande = async (demandeId, e) => {
    e.stopPropagation();
    if (!window.confirm('❌ Rejeter cette demande?')) return;

    try {
      await axios.put(`http://localhost:5000/api/demande/${demandeId}/reject`);
      alert('❌ Demande rejetée');
      fetchNotifications();
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const handleMessageOtherUser = async (notif, e) => {
    e.stopPropagation();
    await handleMarkAsRead(notif._id);
    setShowDropdown(false);
    const isManager = currentUser?.role === 'manager';
    if (isManager) {
      onNavigate('messages', { openUserId: notif.otherUserId });
    } else {
      onNavigate('messages', { openUserName: notif.otherUserName });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'demande_received': return '📩';
      case 'demande_accepted': return '✅';
      case 'demande_rejected': return '❌';
      case 'director_review': return '📋';
      case 'final_approved': return '🎉';
      case 'final_rejected': return '😔';
      default: return '🔔';
    }
  };

  return (
    <div className="nb-notification-bell">
      <div className="nb-bell-icon" onClick={() => setShowDropdown(!showDropdown)}>
        🔔
        {unreadCount > 0 && <span className="nb-badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="nb-notification-dropdown">
          <div className="nb-dropdown-header">
            <h3>Notifications ({notifications.length})</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="nb-mark-all-read">
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="nb-dropdown-body">
            {notifications.length === 0 ? (
              <p className="nb-no-notifications">Aucune notification</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`nb-notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notif._id)}
                >
                  <span className="nb-notif-icon">{getIcon(notif.type)}</span>
                  <div className="nb-notif-content">
                    <p className="nb-notif-message">{notif.message}</p>
                    <span className="nb-notif-time">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>

                    {notif.type === 'demande_received' && notif.demandeId && (
                      <div className="nb-notif-actions">
                        <button
                          className="nb-btn-accept-small"
                          onClick={(e) => handleAcceptDemande(notif.demandeId, e)}
                        >
                          ✅ Accepter
                        </button>
                        <button
                          className="nb-btn-reject-small"
                          onClick={(e) => handleRejectDemande(notif.demandeId, e)}
                        >
                          ❌ Rejeter
                        </button>
                      </div>
                    )}

                    {notif.type === 'final_approved' && notif.otherUserName && onNavigate && (
                      <div className="nb-notif-actions">
                        <button
                          className="nb-btn-message-small"
                          onClick={(e) => handleMessageOtherUser(notif, e)}
                        >
                          💬 Message {notif.otherUserName}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
