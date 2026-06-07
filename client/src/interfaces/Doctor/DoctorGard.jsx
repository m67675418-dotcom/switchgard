// DoctorGard.jsx - ✅ Updated: clickable cards + GardeDetailModal + currentUser prop
import { useState, useEffect } from "react";
import "./DoctorGard.css";
import GardeDetailModal from "../components/GardeDetailModal";

const TABS = ["All", "Active", "Inactive"];

export default function DoctorGard({ onNavigate, currentUser }) {
  const [gardes, setGardes]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState("All");
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState({ owner: "", dateGarde: "", status: "Active" });
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);
  const [selectedGarde, setSelectedGarde] = useState(null); // ✅ NEW

  const showToast = (text, type = "success") => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const fetchGardes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/garde/getAll")
      .then(r => r.json())
      .then(data => { setGardes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchGardes(); }, []);

  const handleAdd = async () => {
    if (!form.owner || !form.dateGarde) { showToast("Please enter owner and date ⚠️", "error"); return; }
    setSaving(true);
    try {
      await fetch("http://localhost:5000/api/garde/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ownerId: currentUser?._id || currentUser?.id, role: "doctor" }),
      });
      showToast("Gard added ✅");
      setForm({ owner: "", dateGarde: "", status: "Active" });
      setShowForm(false);
      fetchGardes();
    } catch (err) { showToast(`Failed: ${err.message} ❌`, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // ✅ prevent opening modal when clicking delete
    if (!window.confirm("Delete this gard?")) return;
    try {
      await fetch(`http://localhost:5000/api/garde/${id}`, { method: "DELETE" });
      setGardes(p => p.filter(g => g._id !== id));
      showToast("Deleted ✅");
    } catch { showToast("Failed to delete ❌", "error"); }
  };

  const filtered = activeTab === "All" ? gardes : gardes.filter(g => g.status === activeTab);
  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; } };

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type === "success" ? "toastSuccess" : "toastError"}`}>{toast.text}</div>}

      <div className="header">
        <button className="backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="headerTitle">Gard Schedule</h2>
        <button className="addBtn" onClick={() => setShowForm(!showForm)}>{showForm ? "✕" : "＋"}</button>
      </div>

      <div className="heroBand">
        <h1>🛡 Guard Management</h1>
        <p>Track and manage all doctor guard shifts</p>
      </div>

      <div className="mainContent">
        <div className="statsRow">
          {[
            { label: "All",      val: gardes.length,                                      color: "#1a56db" },
            { label: "Active",   val: gardes.filter(g => g.status === "Active").length,   color: "#16a34a" },
            { label: "Inactive", val: gardes.filter(g => g.status === "Inactive").length, color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div key={label} className="statCard">
              <span className="statVal" style={{ color }}>{val}</span>
              <span className="statLabel">{label}</span>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="gardForm">
            <h4 className="formTitle">➕ Add New Gard</h4>
            <div className="formGrid">
              <div className="formGroup"><label>Doctor Name *</label>
                <input type="text" placeholder="Doctor name" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} /></div>
              <div className="formGroup"><label>Date *</label>
                <input type="date" value={form.dateGarde} onChange={e => setForm({ ...form, dateGarde: e.target.value })} /></div>
              <div className="formGroup"><label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">✅ Active</option>
                  <option value="Inactive">❌ Inactive</option>
                </select></div>
            </div>
            <button className="saveBtn" onClick={handleAdd} disabled={saving}>{saving ? "Saving..." : "💾 Save Gard"}</button>
          </div>
        )}

        <div className="tabs">
          {TABS.map(t => <button key={t} className={`tabBtn ${activeTab === t ? "tabActive" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>)}
        </div>

        {loading ? (
          <div className="loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty"><span>🛡</span><p>No gards found</p></div>
        ) : (
          <div className="list">
            {filtered.map(g => (
              // ✅ Card is now clickable
              <div key={g._id} className="gardCard" onClick={() => setSelectedGarde(g)} style={{ cursor: "pointer" }}>
                <div className="cardLeft"><div className="shiftBadge">🛡</div></div>
                <div className="cardMiddle">
                  <h4 className="cardName">{g.owner}</h4>
                  <p className="cardDate">📅 {fmt(g.dateGarde)}</p>
                  {g.id && <p className="cardLoc">🏷 ID: {g.id}</p>}
                </div>
                <div className="cardRight">
                  <span className={`shiftLabel ${g.status === "Active" ? "statusActive" : "statusInactive"}`}>{g.status}</span>
                  <button className="deleteBtn" onClick={e => handleDelete(e, g._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottomNav">
        <button className="navBtn" onClick={() => onNavigate?.("home")}><span>🏠</span><span>Home</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("message")}><span>💬</span><span>Messages</span></button>
        <button className="navBtn navActive"><span>🛡</span><span>Shifts</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>

      {/* ✅ MODAL */}
      {selectedGarde && (
        <GardeDetailModal
          garde={selectedGarde}
          currentUser={currentUser}
          role="doctor"
          onClose={() => setSelectedGarde(null)}
          onDemande={() => { setSelectedGarde(null); showToast("Demande sent! ✅"); }}
        />
      )}
    </div>
  );
}