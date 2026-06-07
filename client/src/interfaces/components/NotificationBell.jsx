// NotificationBell.jsx - Shared notification bell for all role Home pages
// Usage: <NotificationBell userId={currentUser._id} role="doctor" onNavigate={onNavigate} />

import { useState, useEffect, useRef } from "react";
import "./NotificationBell.css";

const ROLE_COLOR = {
  doctor:      "#2563eb",
  nurse:       "#10b981",
  firefighter: "#ef4444",
  pharmacist:  "#7c3aed",
};

export default function NotificationBell({ userId, role = "doctor", onNavigate }) {
  const [notifs, setNotifs]   = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef               = useRef(null);
  const color                 = ROLE_COLOR[role] || "#2563eb";

  const unread = notifs.filter(n => !n.read).length;

  const fetchNotifs = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/notification/user/${userId}`)
      .then(r => r.json())
      .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notification/${id}/read`, { method: "PATCH" });
      setNotifs(p => p.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`http://localhost:5000/api/notification/user/${userId}/readAll`, { method: "PATCH" });
      setNotifs(p => p.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleNotifClick = async (notif) => {
    await markRead(notif._id);
    setOpen(false);
    // Navigate based on type
    if (notif.type === "demande_received")  onNavigate?.("demandes");
    if (notif.type === "demande_accepted")  onNavigate?.("garde");
    if (notif.type === "demande_rejected")  onNavigate?.("garde");
    if (notif.type === "director_review")   onNavigate?.("garde");
    if (notif.type === "final_approved")    onNavigate?.("garde");
    if (notif.type === "final_rejected")    onNavigate?.("garde");
  };

  const notifIcon = (type) => {
    const icons = {
      demande_received: "📤",
      demande_accepted: "✅",
      demande_rejected: "❌",
      director_review:  "👔",
      final_approved:   "🎉",
      final_rejected:   "⛔",
      message:          "💬",
    };
    return icons[type] || "🔔";
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="nb-wrap" ref={dropRef}>
      <button
        className="nb-bell"
        style={{ "--nb-color": color }}
        onClick={() => { setOpen(!open); if (!open) fetchNotifs(); }}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="nb-badge" style={{ background: color }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="nb-dropdown">
          <div className="nb-drop-header">
            <span className="nb-drop-title">🔔 Notifications</span>
            {unread > 0 && (
              <button className="nb-mark-all" style={{ color }} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="nb-list">
            {loading ? (
              <div className="nb-loading">
                {[1,2,3].map(i => <div key={i} className="nb-skeleton" />)}
              </div>
            ) : notifs.length === 0 ? (
              <div className="nb-empty">
                <span>🔕</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifs.slice(0, 20).map(n => (
                <button
                  key={n._id}
                  className={`nb-item ${!n.read ? "nb-unread" : ""}`}
                  style={{ "--nb-color": color }}
                  onClick={() => handleNotifClick(n)}
                >
                  <span className="nb-item-icon">{notifIcon(n.type)}</span>
                  <div className="nb-item-body">
                    <p className="nb-item-msg">{n.message}</p>
                    <span className="nb-item-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.read && <span className="nb-dot" style={{ background: color }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}