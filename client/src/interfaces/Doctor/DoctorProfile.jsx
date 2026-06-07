// DoctorProfile.jsx - Fixed Full Width + Bottom Nav
import { useState, useEffect } from "react";
import "./DoctorProfile.css";

export default function DoctorProfile({ doctorId, onNavigate, onUpdateUser }) {
  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast]     = useState(null);
  const [form, setForm]       = useState({});

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    fetch(`http://localhost:5000/api/doctor/${doctorId}`)
      .then(r => r.json())
      .then(data => {
        const d = data.doctor || data;
        setDoctor(d);
        setForm({ fullName: d.fullName||'', email: d.email||'', specialty: d.specialty||'', numOrdre: d.numOrdre||'', location: d.location||'', isAvailable: d.isAvailable??true });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [doctorId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/doctor/${doctorId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      showToast('Doctor updated successfully ✅');
      setDoctor({ ...doctor, ...form }); setEditing(false);
      onUpdateUser?.(form);
    } catch { showToast('Update failed ❌', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this doctor?')) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/api/doctor/${doctorId}`, { method: 'DELETE' });
      onNavigate?.('home');
    } catch { showToast('Delete failed ❌', 'error'); setDeleting(false); }
  };

  if (loading) return (
    <div className="container">
      <div className="skeletonHeader" />
      <div className="skeletonCard" />
    </div>
  );

  if (!doctor) return (
    <div className="container">
      <div className="mainContent">
        <div className="errorBox">
          <span>⚠️</span>
          <p>Doctor not found</p>
          <button className="btnBack" onClick={() => onNavigate?.('home')}>← Go Back</button>
        </div>
      </div>
      <BottomNav onNavigate={onNavigate} active="profile" />
    </div>
  );

  const specialtyOptions = ['Cardiology','Pediatrics','Dermatology','Orthopedics','Neurology','General Practice','Surgery','Psychiatry'];

  return (
    <div className="container">
      {toast && <div className={`toast ${toast.type === 'success' ? 'toastSuccess' : 'toastError'}`}>{toast.text}</div>}

      {/* ── HERO ── */}
      <div className="hero">
        <button className="backBtn" onClick={() => onNavigate?.('home')}>← Back</button>
        <div className="avatarWrap">
          <div className="avatar">🧑‍⚕️</div>
          <span className={`statusDot ${doctor.isAvailable ? 'dotGreen' : 'dotRed'}`} />
        </div>
        <div>
          <h1 className="heroName">{doctor.fullName}</h1>
          <p className="heroSpec">{doctor.specialty}</p>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="mainContent">
        {!editing ? (
          <>
            <div className="infoSection">
              {[
                { icon: '📧', label: 'Email',       val: doctor.email },
                { icon: '🩺', label: 'Specialty',   val: doctor.specialty },
                { icon: '🔢', label: 'Num Ordre',   val: doctor.numOrdre },
                { icon: '📍', label: 'Location',    val: doctor.location || 'Not specified' },
                { icon: '✅', label: 'Availability', val: doctor.isAvailable ? 'Available' : 'Busy' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="infoRow">
                  <div className="infoIcon">{icon}</div>
                  <div className="infoText">
                    <span className="infoLabel">{label}</span>
                    <span className="infoVal">{val}</span>
                  </div>
                </div>
              ))}
              <div className="actions">
                <button className="btnEdit" onClick={() => setEditing(true)}>✏️ Edit</button>
                <button className="btnDelete" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="editForm">
            <h3 className="editTitle">✏️ Edit Doctor</h3>
            <div className="formGroup"><label>Full Name</label>
              <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Full Name" /></div>
            <div className="formGroup"><label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" /></div>
            <div className="formGroup"><label>Specialty</label>
              <select value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})}>
                <option value="">-- Select --</option>
                {specialtyOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div className="formGroup"><label>Num Ordre</label>
              <input type="text" value={form.numOrdre} onChange={e => setForm({...form, numOrdre: e.target.value})} placeholder="Num Ordre" /></div>
            <div className="formGroup"><label>Location</label>
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location" /></div>
            <div className="editActions">
              <button className="btnSave" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
              <button className="btnCancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav onNavigate={onNavigate} active="profile" />
    </div>
  );
}

function BottomNav({ onNavigate, active }) {
  return (
    <div className="bottomNav">
      <button className={`navBtn ${active === 'home' ? 'navActive' : ''}`} onClick={() => onNavigate?.('home')}>
        <span>🏠</span><span>Home</span>
      </button>
      <button className={`navBtn ${active === 'message' ? 'navActive' : ''}`} onClick={() => onNavigate?.('message')}>
        <span>💬</span><span>Messages</span>
      </button>
      <button className={`navBtn ${active === 'garde' ? 'navActive' : ''}`} onClick={() => onNavigate?.('garde')}>
        <span>🛡️</span><span>Shifts</span>
      </button>
      <button className={`navBtn ${active === 'profile' ? 'navActive' : ''}`} onClick={() => onNavigate?.('profile')}>
        <span>👤</span><span>Profile</span>
      </button>
    </div>
  );
}