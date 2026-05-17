import { useState, useEffect } from "react";
import "./PharmacistProfile.css";

export default function PharmacistProfile({ pharmacistId, onNavigate }) {
  const [pharmacist, setPharmacist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!pharmacistId) { setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/api/pharmacist/${pharmacistId}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.pharmacist || data;
        setPharmacist(p);
        setForm({
          userId:           p.userId           || "",
          gmail:            p.gmail            || "",
          nomPharmacie:     p.nomPharmacie     || "",
          adressePharmacie: p.adressePharmacie || "",
          numAgrement:      p.numAgrement      || "",
          isNightShift:     p.isNightShift     || false,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pharmacistId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/updatePharmacist/${pharmacistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMsg({ type: "success", text: "Pharmacist updated successfully ✅" });
      setPharmacist({ ...pharmacist, ...form });
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
    if (!window.confirm("Are you sure you want to delete this pharmacist?")) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/deletepharmacist/${pharmacistId}`, { method: "DELETE" });
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

  if (!pharmacist) return (
    <div className="container">
      <div className="errorBox">
        <span>⚠️</span>
        <p>Pharmacist not found</p>
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
          <div className="avatar">💊</div>
        </div>
        <h2 className="heroName">{pharmacist.nomPharmacie || "Pharmacist"}</h2>
        <span className="heroSpec">{pharmacist.adressePharmacie?.substring(0, 40)}</span>
      </div>

      {!editing ? (
        <div className="infoSection">
          {[
            { icon: "📧", label: "Email",          val: pharmacist.gmail },
            { icon: "🏪", label: "Pharmacy",        val: pharmacist.nomPharmacie },
            { icon: "📍", label: "Address",         val: pharmacist.adressePharmacie || "Not specified" },
            { icon: "📋", label: "Approval Number", val: pharmacist.numAgrement },
            { icon: "🌙", label: "Night Shift",     val: pharmacist.isNightShift ? "✅ Yes" : "❌ No" },
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
          <h3 className="editTitle">Edit Pharmacist Info</h3>
          {[
            { key: "userId",           label: "User ID",        type: "text"  },
            { key: "gmail",            label: "Email",           type: "email" },
            { key: "nomPharmacie",     label: "Pharmacy Name",   type: "text"  },
            { key: "adressePharmacie", label: "Address",         type: "text"  },
            { key: "numAgrement",      label: "Approval Number", type: "text"  },
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
          <div className="formGroup">
            <label>Night Shift</label>
            <select
              value={form.isNightShift}
              onChange={(e) => setForm({ ...form, isNightShift: e.target.value === "true" })}
            >
              <option value="true">🌙 Yes (Night Shift)</option>
              <option value="false">☀️ No (Day Shift)</option>
            </select>
          </div>
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