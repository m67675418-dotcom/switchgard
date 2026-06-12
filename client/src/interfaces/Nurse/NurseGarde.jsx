// NurseGarde.jsx - ✅ Updated: clickable cards + GardeDetailModal
import { useState, useEffect } from "react";
import "./NurseGarde.css";
import GardeDetailModal from "../components/GardeDetailModal";

const TABS = ["All", "Active", "Inactive"];

export default function NurseGarde({ onNavigate, currentUser }) {
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
    fetch("http://localhost:5000/api/garde/getAll?role=nurse")
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
        body: JSON.stringify({ ...form, ownerId: currentUser?._id || currentUser?.id, role: "nurse" }),
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
    <div className="ng-container">
      {toast && <div className={`ng-toast ${toast.type === "success" ? "ng-toastSuccess" : "ng-toastError"}`}>{toast.text}</div>}

      <div className="ng-header">
        <button className="ng-backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="ng-headerTitle">Gard Schedule</h2>
        <button className="ng-addBtn" onClick={() => setShowForm(!showForm)}>{showForm ? "✕" : "＋"}</button>
      </div>

      <div className="ng-heroBand">
        <h1>🛡 Guard Management</h1>
        <p>Track and manage all nurse guard shifts</p>
      </div>

      <div className="ng-mainContent">
        <div className="ng-statsRow">
          {[
            { label: "All",      val: gardes.length,                                      color: "#1a56db" },
            { label: "Active",   val: gardes.filter(g => g.status === "Active").length,   color: "#10b981" },
            { label: "Inactive", val: gardes.filter(g => g.status === "Inactive").length, color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div key={label} className="ng-statCard">
              <span className="ng-statVal" style={{ color }}>{val}</span>
              <span className="ng-statLabel">{label}</span>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="ng-gardForm">
            <h4 className="ng-formTitle">➕ Add New Gard</h4>
            <div className="ng-formGrid">
              <div className="ng-formGroup"><label>Owner Name *</label>
                <input type="text" placeholder="Name" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} /></div>
              <div className="ng-formGroup"><label>Date *</label>
                <input type="date" value={form.dateGarde} onChange={e => setForm({ ...form, dateGarde: e.target.value })} /></div>
              <div className="ng-formGroup"><label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">❌ Inactive</option>
                </select></div>
            </div>
            <button className="ng-saveBtn" onClick={handleAdd} disabled={saving}>{saving ? "Saving..." : "💾 Save Gard"}</button>
          </div>
        )}

        <div className="ng-tabs">
          {TABS.map(t => <button key={t} className={`ng-tabBtn ${activeTab === t ? "ng-tabActive" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>)}
        </div>

        {loading ? (
          <div className="ng-loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="ng-skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="ng-empty"><span>🛡️</span><p>No gards found</p></div>
        ) : (
          <div className="ng-list">
            {filtered.map(g => (
              <div key={g._id} className="ng-gardCard" onClick={() => setSelectedGarde(g)} style={{ cursor: "pointer" }}>
                <div className="ng-cardLeft"><div className="ng-shiftBadge">🛡️</div></div>
                <div className="ng-cardMiddle">
                  <h4 className="ng-cardName">{g.owner}</h4>
                  <p className="ng-cardDate">📅 {fmt(g.dateGarde)}</p>
                </div>
                <div className="ng-cardRight">
                  <span className={`ng-shiftLabel ${g.status === "Active" ? "ng-statusActive" : "ng-statusInactive"}`}>{g.status}</span>
                  <button className="ng-deleteBtn" onClick={e => handleDelete(e, g._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ng-bottomNav">
        <button className="ng-navBtn" onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="ng-navBtn" onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="ng-navBtn ng-navActive"><span>🛡️</span><span>Shifts</span></button>
        <button className="ng-navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>

      {selectedGarde && (
        <GardeDetailModal
          garde={selectedGarde}
          currentUser={currentUser}
          role="nurse"
          onClose={() => setSelectedGarde(null)}
          onDemande={() => { setSelectedGarde(null); showToast("Demande sent! ✅"); }}
        />
      )}
    </div>
  );
}
