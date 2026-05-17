import { useState, useEffect } from "react";
import "./PharmacistGarde.css";

const TABS = ["All", "Active", "Inactive"];

export default function PharmacistGarde({ onNavigate, currentUser }) {
  const [gardes, setGardes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: "", owner: "", dateGarde: "", status: "Active" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ جلب الـ Gardes الخاصة بـ Pharmacist فقط
  const fetchGardes = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/garde/getAll?role=pharmacist")
      .then((r) => r.json())
      .then((data) => {
        setGardes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchGardes(); }, []);

  // ✅ إضافة Garde جديدة بـ role: pharmacist
  const handleAdd = async () => {
    if (!form.owner || !form.dateGarde) {
      showToast("Please fill owner and date ⚠️", "error");
      return;
    }
    setSaving(true);
    try {
      await fetch("http://localhost:5000/api/garde/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "pharmacist" }),
      });
      showToast("Gard added successfully ✅");
      setForm({ id: "", owner: "", dateGarde: "", status: "Active" });
      setShowForm(false);
      fetchGardes();
    } catch {
      showToast("Failed to add gard ❌", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/garde/${id}`, { method: "DELETE" });
      setGardes((prev) => prev.filter((g) => g._id !== id));
      showToast("Gard deleted ✅");
    } catch {
      showToast("Failed to delete ❌", "error");
    }
  };

  const filtered = activeTab === "All" ? gardes : gardes.filter((g) => g.status === activeTab);

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toastSuccess" : "toastError"}`}>
          {toast.text}
        </div>
      )}

      <div className="header">
        <button className="backBtn" onClick={() => onNavigate("home")}>‹</button>
        <h2 className="headerTitle">Gard Schedule</h2>
        <button className="addBtn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕" : "＋"}
        </button>
      </div>

      <div className="statsRow">
        {[
          { label: "All", val: gardes.length, color: "#1a56db" },
          { label: "Active", val: gardes.filter((g) => g.status === "Active").length, color: "#10b981" },
          { label: "Inactive", val: gardes.filter((g) => g.status === "Inactive").length, color: "#ef4444" },
        ].map(({ label, val, color }) => (
          <div key={label} className="statCard">
            <span className="statVal" style={{ color }}>{val}</span>
            <span className="statLabel">{label}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="gardForm">
          <h4 className="formTitle">Add New Gard</h4>
          <div className="formGrid">
            <div className="formGroup">
              <label>Owner (Name) *</label>
              <input
                type="text"
                placeholder="Name"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label>Date *</label>
              <input
                type="date"
                value={form.dateGarde}
                onChange={(e) => setForm({ ...form, dateGarde: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">✅ Active</option>
                <option value="Inactive">❌ Inactive</option>
              </select>
            </div>
          </div>
          <button className="saveBtn" onClick={handleAdd} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Gard"}
          </button>
        </div>
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tabBtn ${activeTab === t ? "tabActive" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <span>🛡️</span>
          <p>No gards found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((g) => (
            <div key={g._id} className="gardCard">
              <div className="cardLeft"><div className="shiftBadge">🛡️</div></div>
              <div className="cardMiddle">
                <h4 className="cardName">{g.owner}</h4>
                <p className="cardDate">📅 {new Date(g.dateGarde).toLocaleDateString()}</p>
              </div>
              <div className="cardRight">
                <span className={`shiftLabel ${g.status === "Active" ? "statusActive" : "statusInactive"}`}>
                  {g.status}
                </span>
                <button className="deleteBtn" onClick={() => handleDelete(g._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottomNav">
        <button className="navBtn" onClick={() => onNavigate("home")}>🏠</button>
        <button className="navBtn" onClick={() => onNavigate("messages")}>💬</button>
        <button className="navBtn navActive" onClick={() => onNavigate("garde")}>🛡️</button>
        <button className="navBtn" onClick={() => onNavigate("profile")}>👤</button>
      </div>
    </div>
  );
}