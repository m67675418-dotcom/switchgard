// FirefighterGarde.jsx - ✅ Updated: clickable cards + GardeDetailModal
import { useState, useEffect } from "react";
import "./FirefighterGarde.css";
import GardeDetailModal from "../components/GardeDetailModal";

const TABS = ["All", "Active", "Inactive"];

export default function FirefighterGarde({ onNavigate, currentUser }) {
  const [gardes, setGardes]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("All");
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ owner: "", dateGarde: "", status: "Active" });
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState(null);
  const [selectedGarde, setSelectedGarde] = useState(null);

  const showToast = (t, type = "success") => { setToast({ text: t, type }); setTimeout(() => setToast(null), 3000); };

  const fetchGardes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/garde/getAll?role=firefighter")
      .then(r => r.json())
      .then(data => { setGardes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchGardes(); }, []);

  const handleAdd = async () => {
    if (!form.owner || !form.dateGarde) { showToast("Fill owner and date ⚠️", "error"); return; }
    setSaving(true);
    try {
      await fetch("http://localhost:5000/api/garde/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ownerId: currentUser?._id || currentUser?.id, role: "firefighter" }),
      });
      showToast("Gard added ✅");
      setForm({ owner: "", dateGarde: "", status: "Active" }); setShowForm(false); fetchGardes();
    } catch { showToast("Failed ❌", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/garde/${id}`, { method: "DELETE" });
      setGardes(p => p.filter(g => g._id !== id)); showToast("Deleted ✅");
    } catch { showToast("Failed ❌", "error"); }
  };

  const filtered = activeTab === "All" ? gardes : gardes.filter(g => g.status === activeTab);
  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; } };

  return (
    <div className="fg-container">
      {toast && <div className={`fg-toast ${toast.type === "success" ? "fg-toastSuccess" : "fg-toastError"}`}>{toast.text}</div>}

      <div className="fg-header">
        <button className="fg-backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="fg-headerTitle">Gard Schedule</h2>
        <button className="fg-addBtn" onClick={() => setShowForm(!showForm)}>{showForm ? "✕" : "＋"}</button>
      </div>

      <div className="fg-heroBand">
        <h1>🛡 Guard Management</h1>
        <p>Track and manage all firefighter guard shifts</p>
      </div>

      <div className="fg-mainContent">
        <div className="fg-statsRow">
          {[
            { label: "All",      val: gardes.length,                                      color: "#1a56db" },
            { label: "Active",   val: gardes.filter(g => g.status === "Active").length,   color: "#ef4444" },
            { label: "Inactive", val: gardes.filter(g => g.status === "Inactive").length, color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div key={label} className="fg-statCard">
              <span className="fg-statVal" style={{ color }}>{val}</span>
              <span className="fg-statLabel">{label}</span>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fg-gardForm">
            <h4 className="fg-formTitle">➕ Add New Gard</h4>
            <div className="fg-formGrid">
              <div className="fg-formGroup"><label>Owner Name *</label>
                <input type="text" placeholder="Name" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} /></div>
              <div className="fg-formGroup"><label>Date *</label>
                <input type="date" value={form.dateGarde} onChange={e => setForm({ ...form, dateGarde: e.target.value })} /></div>
              <div className="fg-formGroup"><label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">❌ Inactive</option>
                </select></div>
            </div>
            <button className="fg-saveBtn" onClick={handleAdd} disabled={saving}>{saving ? "Saving..." : "💾 Save Gard"}</button>
          </div>
        )}

        <div className="fg-tabs">
          {TABS.map(t => <button key={t} className={`fg-tabBtn ${activeTab === t ? "fg-tabActive" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>)}
        </div>

        {loading ? (
          <div className="fg-loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="fg-skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="fg-empty"><span>🛡️</span><p>No gards found</p></div>
        ) : (
          <div className="fg-list">
            {filtered.map(g => (
              <div key={g._id} className="fg-gardCard" onClick={() => setSelectedGarde(g)} style={{ cursor: "pointer" }}>
                <div className="fg-cardLeft"><div className="fg-shiftBadge">🛡️</div></div>
                <div className="fg-cardMiddle">
                  <h4 className="fg-cardName">{g.owner}</h4>
                  <p className="fg-cardDate">📅 {fmt(g.dateGarde)}</p>
                </div>
                <div className="fg-cardRight">
                  <span className={`fg-shiftLabel ${g.status === "Active" ? "fg-statusActive" : "fg-statusInactive"}`}>{g.status}</span>
                  <button className="fg-deleteBtn" onClick={e => handleDelete(e, g._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fg-bottomNav">
        <button className="fg-navBtn" onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="fg-navBtn" onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="fg-navBtn fg-navActive"><span>🛡️</span><span>Shifts</span></button>
        <button className="fg-navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>

      {selectedGarde && (
        <GardeDetailModal
          garde={selectedGarde}
          currentUser={currentUser}
          role="firefighter"
          onClose={() => setSelectedGarde(null)}
          onDemande={() => { setSelectedGarde(null); showToast("Demande sent! ✅"); }}
        />
      )}
    </div>
  );
}
