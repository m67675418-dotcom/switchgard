import { useState, useEffect } from "react";
import "./DoctorGard.css";

const TABS = ["All", "Active", "Inactive"];

export default function DoctorGard({ onNavigate }) {
  const [gardes, setGardes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: "",
    owner: "",
    dateGarde: "",
    status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGardes = () => {
    setLoading(true);
    // ✅ Correct GET path
    fetch("http://localhost:5000/api/garde/getAll")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setGardes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setGardes([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGardes();
  }, []);

  const handleAdd = async () => {
    if (!form.owner || !form.owner.trim()) {
      showToast("Please enter doctor name ⚠️", "error");
      return;
    }
    if (!form.dateGarde) {
      showToast("Please select a date ⚠️", "error");
      return;
    }
    
    setSaving(true);
    
    const dataToSend = {
      owner: form.owner.trim(),
      dateGarde: form.dateGarde,
      status: form.status,
      ...(form.id && form.id.trim() && { id: form.id.trim() })
    };
    
    try {
      // ✅ Correct POST path with /add
      const res = await fetch("http://localhost:5000/api/garde/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      showToast("Gard added successfully ✅");
      setForm({ id: "", owner: "", dateGarde: "", status: "Active" });
      setShowForm(false);
      fetchGardes();
      
    } catch (err) {
      console.error("Add error:", err);
      showToast(`Failed to add gard: ${err.message} ❌`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gard?")) return;
    
    try {
      // ✅ Correct DELETE path with full URL
      const res = await fetch(`http://localhost:5000/deletegarde/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Delete failed");
      
      setGardes((prev) => prev.filter((g) => g._id !== id));
      showToast("Gard deleted ✅");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete gard ❌", "error");
    }
  };

  const filtered = activeTab === "All"
    ? gardes
    : gardes.filter((g) => g.status === activeTab);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="container">
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toastSuccess" : "toastError"}`}>
          {toast.text}
        </div>
      )}

      <div className="header">
        <button className="backBtn" onClick={() => onNavigate?.("home")}>‹</button>
        <h2 className="headerTitle">Gard Schedule</h2>
        <button className="addBtn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕" : "＋"}
        </button>
      </div>
      
      <div className="statsRow">
        {[
          { label: "All", val: gardes.length, color: "#1a56db" },
          { label: "Active", val: gardes.filter((g) => g.status === "Active").length, color: "#16a34a" },
          { label: "Inactive", val: gardes.filter((g) => g.status === "Inactive").length, color: "#dc2626" },
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
              <label>Gard ID (optional)</label>
              <input
                type="text"
                placeholder="Gard ID"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label>Owner (Doctor Name) *</label>
              <input
                type="text"
                placeholder="Doctor name"
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
          <span>🛡</span>
          <p>No gards found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((g) => (
            <div key={g._id} className="gardCard">
              <div className="cardLeft">
                <div className="shiftBadge">🛡</div>
              </div>
              <div className="cardMiddle">
                <h4 className="cardName">{g.owner}</h4>
                <p className="cardDate">📅 {formatDate(g.dateGarde)}</p>
                {g.id && <p className="cardLoc">🏷 ID: {g.id}</p>}
              </div>
              <div className="cardRight">
                <span className={`shiftLabel ${g.status === "Active" ? "statusActive" : "statusInactive"}`}>
                  {g.status}
                </span>
                <button className="deleteBtn" onClick={() => handleDelete(g._id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottomNav">
        <button className="navBtn" onClick={() => onNavigate?.("home")}>🏠</button>
        <button className="navBtn" onClick={() => onNavigate?.("messages")}>💬</button>
        <button className="navBtn navActive">🛡</button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}>👤</button>
      </div>
    </div>
  );
}