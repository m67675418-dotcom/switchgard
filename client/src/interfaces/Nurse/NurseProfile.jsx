import { useState, useEffect } from "react";
import "./NurseProfile.css";

export default function NurseProfile({ nurseId, onNavigate, onUpdateUser }) {
  const [nurse, setNurse]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg]         = useState(null);

  useEffect(() => {
    if (!nurseId) { setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/api/nurse/${nurseId}`)
      .then((r) => r.json())
      .then((data) => {
        const n = data.nurse || data;
        setNurse(n);
        setForm({ fullName: n.fullName||'', userId: n.userId||'', gmail: n.gmail||'', diplome: n.diplome||'', service: n.service||'', equipe: n.equipe||'' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [nurseId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/nurse/${nurseId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      setMsg({ type: 'success', text: 'Updated successfully ✅' });
      setNurse({ ...nurse, ...form }); setEditing(false);
      onUpdateUser?.(form);
    } catch { setMsg({ type: 'error', text: 'Update failed ❌' }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this nurse?')) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/api/nurse/${nurseId}`, { method: 'DELETE' });
      onNavigate?.('home');
    } catch { setMsg({ type: 'error', text: 'Delete failed ❌' }); setDeleting(false); }
  };

  if (loading) return (
    <div className="np-page">
      <div className="np-skeleton-hero" />
      <div className="np-main"><div className="np-skeleton-card" /></div>
    </div>
  );

  if (!nurse) return (
    <div className="np-page">
      <div className="np-main">
        <div className="np-error-box">
          <span className="np-error-icon">⚠️</span>
          <p>Nurse not found</p>
          <button className="np-btn-back" onClick={() => onNavigate?.('home')}>← Go Back</button>
        </div>
      </div>
    </div>
  );

  const fields = [
    { icon: '👤', label: 'Full Name', val: nurse.fullName || 'Not specified' },
    { icon: '✉️', label: 'Email',     val: nurse.gmail },
    { icon: '🎓', label: 'Diploma',   val: nurse.diplome },
    { icon: '🏥', label: 'Service',   val: nurse.service || 'Not specified' },
    { icon: '👥', label: 'Team',      val: nurse.equipe  || 'Not specified' },
  ];

  const editFields = [
    { key: 'fullName', label: 'Full Name', type: 'text'  },
    { key: 'userId',   label: 'User ID',   type: 'text'  },
    { key: 'gmail',    label: 'Email',     type: 'email' },
    { key: 'diplome',  label: 'Diploma',   type: 'text'  },
    { key: 'service',  label: 'Service',   type: 'text'  },
    { key: 'equipe',   label: 'Team',      type: 'text'  },
  ];

  return (
    <div className="np-page">

      {/* ── HERO ── */}
      <div className="np-hero">
        <button className="np-back-btn" onClick={() => onNavigate?.('home')}>← Back</button>
        <div className="np-avatar">👩‍⚕️</div>
        <div className="np-hero-info">
          <h2 className="np-hero-name">{nurse.fullName || nurse.userId || 'Nurse'}</h2>
          <span className="np-hero-badge">{nurse.diplome || 'Nurse'}</span>
        </div>
        <span className="np-status-dot" title="Active" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="np-main">
        {msg && <div className={`np-toast ${msg.type}`}>{msg.text}</div>}

        {!editing ? (
          <>
            <div className="np-info-card">
              {fields.map(({ icon, label, val }) => (
                <div key={label} className="np-info-row">
                  <span className="np-info-icon">{icon}</span>
                  <div className="np-info-text">
                    <span className="np-info-label">{label}</span>
                    <span className="np-info-val">{val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="np-actions">
              <button className="np-btn edit" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
              <button className="np-btn delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </>
        ) : (
          <div className="np-edit-card">
            <h3 className="np-edit-title">Edit Nurse Info</h3>
            {editFields.map(({ key, label, type }) => (
              <div key={key} className="np-form-group">
                <label>{label}</label>
                <input type={type} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={label} />
              </div>
            ))}
            <div className="np-edit-actions">
              <button className="np-btn save" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button className="np-btn cancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
