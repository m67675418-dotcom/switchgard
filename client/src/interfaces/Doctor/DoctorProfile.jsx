import { useState, useEffect } from "react";
import "./DoctorProfile.css";

export default function DoctorProfile({ doctorId, onNavigate }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/api/doctor/${doctorId}`)
      .then((r) => r.json())
      .then((data) => {
        const d = data.doctor || data;
        setDoctor(d);
        setForm({
          fullName:    d.fullName    || "",
          email:       d.email       || "",
          specialty:   d.specialty   || "",
          numOrdre:    d.numOrdre    || "",
          location:    d.location    || "",
          isAvailable: d.isAvailable ?? true,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [doctorId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/updateDoctor/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMsg({ type: "success", text: "Doctor updated successfully ✅" });
      setDoctor({ ...doctor, ...form });
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
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/DeleteDoctor/${doctorId}`, { method: "DELETE" });
      onNavigate?.("home");
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

  if (!doctor) return (
    <div className="container">
      <div className="errorBox">
        <span>⚠️</span>
        <p>Doctor not found</p>
        <button className="btnBack" onClick={() => onNavigate?.("home")}>Go Back</button>
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
        <button className="backBtn" onClick={() => onNavigate?.("home")}>‹ Back</button>
        <div className="avatarWrap">
          <div className="avatar">🧑‍⚕️</div>
          <span className={`statusDot ${doctor.isAvailable ? "dotGreen" : "dotRed"}`} />
        </div>
        <h2 className="heroName">{doctor.fullName}</h2>
        <span className="heroSpec">{doctor.specialty}</span>
      </div>

      {!editing ? (
        <div className="infoSection">
          {[
            { icon: "📧", label: "Email",        val: doctor.email },
            { icon: "🏷️", label: "Order Number", val: doctor.numOrdre },
            { icon: "📍", label: "Location",      val: doctor.location || "Not specified" },
            { icon: "✅", label: "Availability",  val: doctor.isAvailable ? "Available" : "Not Available" },
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
          <h3 className="editTitle">Edit Doctor Info</h3>
          {[
            { key: "fullName",  label: "Full Name",   type: "text"  },
            { key: "email",     label: "Email",        type: "email" },
            { key: "specialty", label: "Specialty",    type: "text"  },
            { key: "numOrdre",  label: "Order Number", type: "text"  },
            { key: "location",  label: "Location",     type: "text"  },
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
            <label>Availability</label>
            <select
              value={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "true" })}
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
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