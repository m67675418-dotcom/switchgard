// PharmacistGarde.jsx - ✅ Updated: clickable cards + GardeDetailModal
import { useState, useEffect } from "react";
import "./PharmacistGarde.css";
import GardeDetailModal from "../components/GardeDetailModal";

const TABS = ["All", "Active", "Inactive"];

export default function PharmacistGarde({ onNavigate, currentUser }) {
  const [gardes, setGardes]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("All");
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ owner: "", dateGarde: "", status: "Active" });
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState(null);
  const [selectedGarde, setSelectedGarde] = useState(null);

  const showToast = (text, type = "success") => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const fetchGardes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/garde/getAll?role=pharmacist")
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
        body: JSON.stringify({ ...form, ownerId: currentUser?._id || currentUser?.id, role: "pharmacist" }),
      });
      showToast("Gard added ✅");
      setForm({ owner: "", dateGarde: "", status: "Active" });
      setShowForm(false); fetchGardes();
    } catch { showToast("Failed ❌", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/garde/${id}`, { method: "DELETE" });
      setGardes(p => p.filter(g => g._id !== id));
      showToast("Deleted ✅");
    } catch { showToast("Failed ❌", "error"); }
  };

  const filtered = activeTab === "All" ? gardes : gardes.filter(g => g.status === activeTab);
  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; } };

  return (
    <div className="pg-container">
      {toast && <div className={`pg-toast ${toast.type === "success" ? "pg-toastSuccess" : "pg-toastError"}`}>{toast.text}</div>}

      <div className="pg-header">
        <button className="pg-backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="pg-headerTitle">Gard Schedule</h2>
        <button className="pg-addBtn" onClick={() => setShowForm(!showForm)}>{showForm ? "✕" : "＋"}</button>
      </div>

      <div className="pg-heroBand">
        <h1>🛡 Guard Management</h1>
        <p>Track and manage all pharmacist guard shifts</p>
      </div>

      <div className="pg-mainContent">
        <div className="pg-statsRow">
          {[
            { label: "All",      val: gardes.length,                                      color: "#1a56db" },
            { label: "Active",   val: gardes.filter(g => g.status === "Active").length,   color: "#059669" },
            { label: "Inactive", val: gardes.filter(g => g.status === "Inactive").length, color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div key={label} className="pg-statCard">
              <span className="pg-statVal" style={{ color }}>{val}</span>
              <span className="pg-statLabel">{label}</span>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="pg-gardForm">
            <h4 className="pg-formTitle">➕ Add New Gard</h4>
            <div className="pg-formGrid">
              <div className="pg-formGroup"><label>Owner Name *</label>
                <input type="text" placeholder="Name" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} /></div>
              <div className="pg-formGroup"><label>Date *</label>
                <input type="date" value={form.dateGarde} onChange={e => setForm({ ...form, dateGarde: e.target.value })} /></div>
              <div className="pg-formGroup"><label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">❌ Inactive</option>
                </select></div>
            </div>
            <button className="pg-saveBtn" onClick={handleAdd} disabled={saving}>{saving ? "Saving..." : "💾 Save Gard"}</button>
          </div>
        )}

        <div className="pg-tabs">
          {TABS.map(t => <button key={t} className={`pg-tabBtn ${activeTab === t ? "pg-tabActive" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>)}
        </div>

        {loading ? (
          <div className="pg-loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="pg-skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="pg-empty"><span>🛡</span><p>No gards found</p></div>
        ) : (
          <div className="pg-list">
            {filtered.map(g => (
              <div key={g._id} className="pg-gardCard" onClick={() => setSelectedGarde(g)} style={{ cursor: "pointer" }}>
                <div className="pg-cardLeft"><div className="pg-shiftBadge">🛡</div></div>
                <div className="pg-cardMiddle">
                  <h4 className="pg-cardName">{g.owner}</h4>
                  <p className="pg-cardDate">📅 {fmt(g.dateGarde)}</p>
                </div>
                <div className="pg-cardRight">
                  <span className={`pg-shiftLabel ${g.status === "Active" ? "pg-statusActive" : "pg-statusInactive"}`}>{g.status}</span>
                  <button className="pg-deleteBtn" onClick={e => handleDelete(e, g._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pg-bottomNav">
        <button className="pg-navBtn" onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="pg-navBtn" onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="pg-navBtn pg-navActive"><span>🛡️</span><span>Shifts</span></button>
        <button className="pg-navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>

      {selectedGarde && (
        <GardeDetailModal
          garde={selectedGarde}
          currentUser={currentUser}
          role="pharmacist"
          onClose={() => setSelectedGarde(null)}
          onDemande={() => { setSelectedGarde(null); showToast("Demande sent! ✅"); }}
        />
      )}
    </div>
  );
}
