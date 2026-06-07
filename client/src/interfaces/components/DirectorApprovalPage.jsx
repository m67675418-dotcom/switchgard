// DirectorApprovalPage.jsx - For Directors (DDS / Protection Civil)
// Shows accepted demandes waiting for final director approval
// Usage: <DirectorApprovalPage currentUser={currentUser} role="doctor" onNavigate={onNavigate} />

import { useState, useEffect } from "react";
import "./DirectorApprovalPage.css";

const ROLE_CONFIG = {
  doctor:      { color: "#2563eb", light: "#eff6ff", dark: "#1e3a8a", dirLabel: "DDS Director"              },
  nurse:       { color: "#10b981", light: "#f0fdf4", dark: "#065f46", dirLabel: "Health Director"            },
  firefighter: { color: "#ef4444", light: "#fff1f1", dark: "#7f1d1d", dirLabel: "Protection Civil Director"  },
  pharmacist:  { color: "#7c3aed", light: "#f5f3ff", dark: "#4c1d95", dirLabel: "Health Director"            },
};

export default function DirectorApprovalPage({ currentUser, role = "doctor", onNavigate }) {
  const [demandes, setDemandes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [acting, setActing]       = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [toast, setToast]         = useState(null);
  const [expanded, setExpanded]   = useState(null); // which card is expanded

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.doctor;

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDemandes = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/demande/director?role=${role}`)
      .then(r => r.json())
      .then(data => { setDemandes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchDemandes(); }, [role]);

  const handleDecision = async (demandeId, decision) => {
    setActing(demandeId);
    try {
      const res = await fetch(`http://localhost:5000/api/demande/${demandeId}/director-${decision}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directorId: currentUser._id, role }),
      });
      if (res.ok) {
        showToast(
          decision === "approve"
            ? "✅ Approved! Garde archived & both users notified."
            : "❌ Rejected. Both users notified."
        );
        fetchDemandes();
        setExpanded(null);
      }
    } catch { showToast("Action failed ❌", "error"); }
    finally { setActing(null); }
  };

  const filtered = demandes.filter(d => {
    if (activeTab === "pending")  return d.directorStatus === "pending" || !d.directorStatus;
    if (activeTab === "approved") return d.directorStatus === "approved";
    if (activeTab === "rejected") return d.directorStatus === "rejected";
    return true;
  });

  const counts = {
    pending:  demandes.filter(d => !d.directorStatus || d.directorStatus === "pending").length,
    approved: demandes.filter(d => d.directorStatus === "approved").length,
    rejected: demandes.filter(d => d.directorStatus === "rejected").length,
  };

  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }); } catch { return d; } };

  return (
    <div className="dir-page">
      {toast && (
        <div className={`dir-toast ${toast.type === "success" ? "dir-toast-ok" : "dir-toast-err"}`}>
          {toast.text}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="dir-header">
        <button className="dir-back" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="dir-header-title" style={{ color: cfg.dark }}>Director Panel</h2>
        <button className="dir-refresh" onClick={fetchDemandes}>🔄</button>
      </div>

      {/* ── HERO ── */}
      <div className="dir-hero" style={{ background: `linear-gradient(135deg, ${cfg.dark}, ${cfg.color})` }}>
        <div className="dir-hero-badge">👔 {cfg.dirLabel}</div>
        <h1>Garde Approval Panel</h1>
        <p>Review and approve garde exchange requests</p>
        <div className="dir-hero-stats">
          <div><span>{counts.pending}</span><small>Awaiting</small></div>
          <div><span>{counts.approved}</span><small>Approved</small></div>
          <div><span>{counts.rejected}</span><small>Rejected</small></div>
        </div>
      </div>

      <div className="dir-main">
        {/* ── TABS ── */}
        <div className="dir-tabs">
          {["pending","approved","rejected"].map(t => (
            <button
              key={t}
              className={`dir-tab ${activeTab === t ? "dir-tab-active" : ""}`}
              style={activeTab === t ? { background: cfg.color, color: "white", borderColor: cfg.color } : {}}
              onClick={() => setActiveTab(t)}
            >
              {t === "pending" ? "⏳" : t === "approved" ? "✅" : "❌"} {t.charAt(0).toUpperCase() + t.slice(1)}
              {counts[t] > 0 && (
                <span className="dir-tab-badge"
                  style={activeTab === t ? { background: "rgba(255,255,255,0.25)" } : { background: cfg.light, color: cfg.color }}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div className="dir-loading">{[1,2,3].map(i=><div key={i} className="dir-skeleton"/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="dir-empty">
            <span>{activeTab === "pending" ? "📭" : activeTab === "approved" ? "✅" : "❌"}</span>
            <p>No {activeTab} approvals</p>
          </div>
        ) : (
          <div className="dir-list">
            {filtered.map(d => (
              <div key={d._id} className="dir-card" style={{ "--dc": cfg.color, "--dl": cfg.light }}>

                {/* Card header */}
                <div className="dir-card-header" onClick={() => setExpanded(expanded === d._id ? null : d._id)}>
                  <div className="dir-card-icon">🛡️</div>
                  <div className="dir-card-summary">
                    <h4>{d.gardeOwner} ⇄ {d.demandeurName}</h4>
                    <p>📅 {fmt(d.gardeDate)}</p>
                  </div>
                  <span className={`dir-card-badge dir-badge-${d.directorStatus || "pending"}`}>
                    {d.directorStatus === "approved" ? "✅ Approved" : d.directorStatus === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                  </span>
                  <span className="dir-expand">{expanded === d._id ? "▲" : "▼"}</span>
                </div>

                {/* Expanded: both profiles */}
                {expanded === d._id && (
                  <div className="dir-card-body">
                    {/* Two profile cards */}
                    <div className="dir-profiles">
                      {/* Garde Owner */}
                      <div className="dir-profile-card" style={{ borderColor: cfg.color + "44" }}>
                        <div className="dir-profile-header" style={{ background: cfg.light }}>
                          <span>🛡️</span>
                          <div>
                            <strong style={{ color: cfg.color }}>Garde Owner</strong>
                            <p>{d.gardeOwner}</p>
                          </div>
                        </div>
                        <ProfileInfo profile={d.ownerProfile} role={role} />
                      </div>
                      {/* Demandeur */}
                      <div className="dir-profile-card" style={{ borderColor: "#64748b44" }}>
                        <div className="dir-profile-header" style={{ background: "#f8fafc" }}>
                          <span>📤</span>
                          <div>
                            <strong style={{ color: "#475569" }}>Requester</strong>
                            <p>{d.demandeurName}</p>
                          </div>
                        </div>
                        <ProfileInfo profile={d.demandeurProfile} role={role} />
                      </div>
                    </div>

                    {/* Action buttons */}
                    {(!d.directorStatus || d.directorStatus === "pending") && (
                      <div className="dir-actions">
                        <button
                          className="dir-btn dir-btn-approve"
                          style={{ background: cfg.color }}
                          onClick={() => handleDecision(d._id, "approve")}
                          disabled={acting === d._id}
                        >
                          {acting === d._id ? "⏳ Processing..." : "✅ Approve & Archive"}
                        </button>
                        <button
                          className="dir-btn dir-btn-reject"
                          onClick={() => handleDecision(d._id, "reject")}
                          disabled={acting === d._id}
                        >
                          {acting === d._id ? "⏳ Processing..." : "❌ Reject"}
                        </button>
                      </div>
                    )}

                    {d.directorStatus === "approved" && (
                      <div className="dir-done-banner dir-done-ok">
                        🎉 Approved & archived — both users have been notified
                      </div>
                    )}
                    {d.directorStatus === "rejected" && (
                      <div className="dir-done-banner dir-done-no">
                        ⛔ Rejected — both users have been notified
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="dir-bottom-nav">
        <button className="dir-nav-btn" style={{ "--dc": cfg.color, "--dl": cfg.light }} onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="dir-nav-btn" style={{ "--dc": cfg.color, "--dl": cfg.light }} onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="dir-nav-btn dir-nav-active" style={{ "--dc": cfg.color, "--dl": cfg.light }}><span>👔</span><span>Approval</span></button>
        <button className="dir-nav-btn" style={{ "--dc": cfg.color, "--dl": cfg.light }} onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>
    </div>
  );
}

function ProfileInfo({ profile, role }) {
  if (!profile) return <p className="dir-no-profile">Profile not loaded</p>;
  const fields = {
    doctor:      [["Email", profile.email], ["Specialty", profile.specialty], ["Num Ordre", profile.numOrdre], ["Location", profile.location]],
    nurse:       [["Email", profile.gmail], ["Diploma", profile.diplome], ["Service", profile.service], ["Team", profile.equipe]],
    firefighter: [["Email", profile.gmail], ["Matricule", profile.matricule], ["Grade", profile.grade], ["Unit", profile.uniteIntervention]],
    pharmacist:  [["Email", profile.gmail], ["Pharmacy", profile.nomPharmacie], ["Address", profile.adressePharmacie], ["Agrement", profile.numAgrement]],
  }[role] || [];
  return (
    <div className="dir-profile-fields">
      {fields.map(([label, val]) => val ? (
        <div key={label} className="dir-profile-field">
          <span>{label}</span>
          <strong>{val}</strong>
        </div>
      ) : null)}
    </div>
  );
}