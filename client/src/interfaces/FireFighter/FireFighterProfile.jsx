import { useState, useEffect } from "react";
import "./FirefighterProfile.css";

export default function FirefighterProfile({ firefighterId, onNavigate }) {
  const [firefighter, setFirefighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!firefighterId) { setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/api/firefighter/${firefighterId}`)
      .then((r) => r.json())
      .then((data) => {
        const f = data.firefighter || data;
        setFirefighter(f);
        setForm({
          userId:            f.userId            || "",
          gmail:             f.gmail             || "",
          matricule:         f.matricule         || "",
          grade:             f.grade             || "",
          uniteIntervention: f.uniteIntervention || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [firefighterId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/firefighter/${firefighterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMsg({ type: "success", text: "Firefighter updated successfully ✅" });
      setFirefighter({ ...firefighter, ...form });
      setEditing(false);

      // ✅ نحدّث الـ localStorage باش يتحدّث في كل الصفحات
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...form }));

    } catch {
      setMsg({ type: "error", text: "Update failed ❌" });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this firefighter?")) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/api/firefighter/${firefighterId}`, { method: "DELETE" });
      onNavigate("home");
    } catch {
      setMsg({ type: "error", text: "Delete failed ❌" });
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="container">
      <div className="skeletonHeader" />
      <div className="skeletonCard" />
    </div>
  );

  if (!firefighter) return (
    <div className="container">
      <div className="errorBox">
        <span>⚠️</span>
        <p>Firefighter not found</p>
        <button className="btnBack" onClick={() => onNavigate("home")}>Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {msg && (
        <div className={`toast ${msg.type === "success" ? "toastSuccess" : "toastError"}`}>
          {msg.text}
        </div>
      )}

      <div className="hero">
        <button className="backBtn" onClick={() => onNavigate("home")}>‹ Back</button>
        <div className="avatarWrap">
          <div className="avatar">🚒</div>
        </div>
        <h2 className="heroName">{firefighter.matricule || "Firefighter"}</h2>
        <span className="heroSpec">{firefighter.grade}</span>
      </div>

      {!editing ? (
        <div className="infoSection">
          {[
            { icon: "📧", label: "Email",     val: firefighter.gmail },
            { icon: "🔢", label: "Matricule", val: firefighter.matricule },
            { icon: "🎖️", label: "Grade",     val: firefighter.grade },
            { icon: "🚒", label: "Unit",      val: firefighter.uniteIntervention || "Not specified" },
          ].map(({ icon, label, val }) => (
            <div key={label} className="infoRow">
              <span className="infoIcon">{icon}</span>
              <div className="infoText">
                <span className="infoLabel">{label}</span>
                <span className="infoVal">{val}</span>
              </div>
            </div>
          ))}
          <div className="actions">
            <button className="btnEdit" onClick={() => setEditing(true)}>✏️ Edit</button>
            <button className="btnDelete" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        </div>
      ) : (
        <div className="editForm">
          <h3 className="editTitle">Edit Firefighter Info</h3>
          {[
            { key: "userId",            label: "User ID",   type: "text"  },
            { key: "gmail",             label: "Email",      type: "email" },
            { key: "matricule",         label: "Matricule",  type: "text"  },
            { key: "grade",             label: "Grade",      type: "text"  },
            { key: "uniteIntervention", label: "Unit",       type: "text"  },
          ].map(({ key, label, type }) => (
            <div key={key} className="formGroup">
              <label>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="editActions">
            <button className="btnSave" onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving..." : "💾 Save"}
            </button>
            <button className="btnCancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}