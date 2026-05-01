import { useState, useEffect } from "react";
import './DoctorProfile.css';

export default function DoctorProfile({ doctorId, onNavigate }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/api/doctor/${doctorId}`)
      .then((r) => r.json())
      .then((data) => {
        const d = data.doctor || data;
        setDoctor(d);
        setForm({
          fullName: d.fullName || "",
          email: d.email || "",
          specialty: d.specialty || "",
          numOrdre: d.numOrdre || "",
          location: d.location || "",
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
      await fetch(`http://localhost:5000/DeleteDoctor/${doctorId}`, {
        method: "DELETE",
      });
      onNavigate?.("home");
    } catch {
      setMsg({ type: "error", text: "Delete failed ❌" });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-container">
        <div className="error-box">
          <span>⚠️</span>
          <p>Doctor not found</p>
          <button className="btn-back" onClick={() => onNavigate?.("home")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-container">
      {msg && (
        <div className={`toast ${msg.type === "success" ? "toast-success" : "toast-error"}`}>
          {msg.text}
        </div>
      )}

      <div className="profile-header">
        <button className="back-btn" onClick={() => onNavigate?.("home")}>
          ‹ Back
        </button>
        <h2>Doctor Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">🧑‍⚕️</div>
          <h2 className="profile-name">{doctor.fullName}</h2>
          <p className="profile-specialty">{doctor.specialty}</p>
        </div>

        {!editing ? (
          <div className="profile-info">
            <div className="info-section">
              <h3>Contact Information</h3>
              <div className="info-row">
                <span className="info-icon">📧</span>
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{doctor.email}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">🏷</span>
                <div className="info-content">
                  <span className="info-label">Order Number</span>
                  <span className="info-value">{doctor.numOrdre}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">📍</span>
                <div className="info-content">
                  <span className="info-label">Location</span>
                  <span className="info-value">{doctor.location || "Not specified"}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">✅</span>
                <div className="info-content">
                  <span className="info-label">Availability</span>
                  <span className={`status-badge ${doctor.isAvailable ? "status-available" : "status-busy"}`}>
                    {doctor.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={() => setEditing(true)}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "🗑 Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="edit-form">
            <h3 className="edit-title">Edit Doctor Info</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Specialty</label>
              <input
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Order Number</label>
              <input
                type="text"
                value={form.numOrdre}
                onChange={(e) => setForm({ ...form, numOrdre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select
                value={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "true" })}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving..." : "💾 Save"}
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}