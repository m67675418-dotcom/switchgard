// DemandesPage.jsx - Shared page for all roles
// Shows incoming garde demandes for the current user (garde owner)
// Usage: <DemandesPage currentUser={currentUser} role="doctor" onNavigate={onNavigate} />

import { useState, useEffect } from "react";
import "./DemandesPage.css";

const ROLE_CONFIG = {
  doctor:      { color: "#2563eb", light: "#eff6ff", dark: "#1e3a8a", avatar: "🧑‍⚕️", label: "Doctor"      },
  nurse:       { color: "#10b981", light: "#f0fdf4", dark: "#065f46", avatar: "👩‍⚕️", label: "Nurse"       },
  firefighter: { color: "#ef4444", light: "#fff1f1", dark: "#7f1d1d", avatar: "🚒",    label: "Firefighter" },
  pharmacist:  { color: "#7c3aed", light: "#f5f3ff", dark: "#4c1d95", avatar: "💊",    label: "Pharmacist"  },
};

export default function DemandesPage({ currentUser, role = "doctor", onNavigate }) {
  const [demandes, setDemandes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [acting, setActing]       = useState(null); // id being acted on
  const [toast, setToast]         = useState(null);

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.doctor;

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDemandes = () => {
    if (!currentUser?._id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/demande/received/${currentUser._id}`)
      .then(r => r.json())
      .then(data => { setDemandes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchDemandes(); }, [currentUser]);

  const handleAction = async (demandeId, action) => {
    setActing(demandeId);
    try {
      const res = await fetch(`http://localhost:5000/api/demande/${demandeId}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proprietaireId: currentUser._id, role }),
      });
      if (res.ok) {
        showToast(action === "accept" ? "Demande accepted ✅ — Notifications sent!" : "Demande rejected ❌");
        fetchDemandes();
      }
    } catch { showToast("Action failed ❌", "error"); }
    finally { setActing(null); }
  };

  const filtered = demandes.filter(d => {
    if (activeTab === "pending")  return d.status === "pending";
    if (activeTab === "accepted") return d.status === "accepted";
    if (activeTab === "rejected") return d.status === "rejected";
    return true;
  });

  const counts = {
    pending:  demandes.filter(d => d.status === "pending").length,
    accepted: demandes.filter(d => d.status === "accepted").length,
    rejected: demandes.filter(d => d.status === "rejected").length,
  };

  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }); } catch { return d; } };
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
    <div className="dp-page">
      {toast && (
        <div className={`dp-toast ${toast.type === "success" ? "dp-toast-success" : "dp-toast-error"}`}>
          {toast.text}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="dp-header">
        <button className="dp-back-btn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="dp-header-title" style={{ color: cfg.dark }}>Garde Demandes</h2>
        <button className="dp-refresh-btn" onClick={fetchDemandes} title="Refresh">🔄</button>
      </div>

      {/* ── HERO ── */}
      <div className="dp-hero" style={{ background: `linear-gradient(135deg, ${cfg.dark}, ${cfg.color})` }}>
        <h1>📤 Demandes Received</h1>
        <p>Manage requests for your garde shifts</p>
        <div className="dp-hero-stats">
          <div className="dp-hero-stat">
            <span>{counts.pending}</span>
            <small>Pending</small>
          </div>
          <div className="dp-hero-stat">
            <span>{counts.accepted}</span>
            <small>Accepted</small>
          </div>
          <div className="dp-hero-stat">
            <span>{counts.rejected}</span>
            <small>Rejected</small>
          </div>
        </div>
      </div>

      <div className="dp-main">
        {/* ── TABS ── */}
        <div className="dp-tabs">
          {["pending", "accepted", "rejected"].map(t => (
            <button
              key={t}
              className={`dp-tab ${activeTab === t ? "dp-tab-active" : ""}`}
              style={activeTab === t ? { background: cfg.color, color: "white" } : {}}
              onClick={() => setActiveTab(t)}
            >
              {t === "pending" ? "⏳" : t === "accepted" ? "✅" : "❌"} {t.charAt(0).toUpperCase() + t.slice(1)}
              {counts[t] > 0 && <span className="dp-tab-count" style={activeTab === t ? { background: "rgba(255,255,255,0.3)" } : { background: cfg.light, color: cfg.color }}>{counts[t]}</span>}
            </button>
          ))}
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div className="dp-loading">{[1,2,3].map(i => <div key={i} className="dp-skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="dp-empty">
            <span>{activeTab === "pending" ? "📭" : activeTab === "accepted" ? "✅" : "❌"}</span>
            <p>No {activeTab} demandes</p>
          </div>
        ) : (
          <div className="dp-list">
            {filtered.map(d => (
              <div key={d._id} className="dp-card" style={{ "--dp-color": cfg.color, "--dp-light": cfg.light }}>
                <div className="dp-card-top">
                  <div className="dp-card-avatar">{cfg.avatar}</div>
                  <div className="dp-card-info">
                    <h4 className="dp-card-name">{d.demandeurName || d.demandeurId}</h4>
                    <p className="dp-card-sub">Requesting your garde</p>
                  </div>
                  <span className={`dp-card-status dp-status-${d.status}`}>
                    {d.status === "pending" ? "⏳ Pending" : d.status === "accepted" ? "✅ Accepted" : "❌ Rejected"}
                  </span>
                </div>

                <div className="dp-card-details">
                  <div className="dp-card-detail">
                    <span>📅</span>
                    <span>Garde: <strong>{fmt(d.gardeDate)}</strong></span>
                  </div>
                  <div className="dp-card-detail">
                    <span>🛡️</span>
                    <span>Owner: <strong>{d.gardeOwner}</strong></span>
                  </div>
                  <div className="dp-card-detail">
                    <span>🕐</span>
                    <span>Sent: <strong>{timeAgo(d.createdAt)}</strong></span>
                  </div>
                </div>

                {d.status === "pending" && (
                  <div className="dp-card-actions">
                    <button
                      className="dp-btn dp-btn-accept"
                      style={{ background: cfg.color }}
                      onClick={() => handleAction(d._id, "accept")}
                      disabled={acting === d._id}
                    >
                      {acting === d._id ? "..." : "✅ Accept"}
                    </button>
                    <button
                      className="dp-btn dp-btn-reject"
                      onClick={() => handleAction(d._id, "reject")}
                      disabled={acting === d._id}
                    >
                      {acting === d._id ? "..." : "❌ Reject"}
                    </button>
                  </div>
                )}

                {d.status === "accepted" && (
                  <div className="dp-card-accepted-info">
                    <span>🎉</span>
                    <p>Accepted — Director has been notified for final approval</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="dp-bottom-nav">
        <button className="dp-nav-btn" style={{ "--dp-color": cfg.color }} onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="dp-nav-btn" style={{ "--dp-color": cfg.color }} onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="dp-nav-btn dp-nav-active" style={{ "--dp-color": cfg.color }}><span>📤</span><span>Demandes</span></button>
        <button className="dp-nav-btn" style={{ "--dp-color": cfg.color }} onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>
    </div>
  );
}