import { useState, useEffect } from "react";
import "./NurseProfile.css";

export default function NurseProfile({ nurseId, onNavigate }) {
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!nurseId) { setLoading(false); return; }
    setLoading(true);
    fetch(`http://localhost:5000/api/nurse/${nurseId}`)
      .then((r) => r.json())
      .then((data) => {
        const n = data.nurse || data;
        setNurse(n);
        setForm({
          userId:  n.userId  || "",
          gmail:   n.gmail   || "",
          diplome: n.diplome || "",
          service: n.service || "",
          equipe:  n.equipe  || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [nurseId]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/nurse/${nurseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMsg({ type: "success", text: "✅ تم تحديث الممرضة بنجاح" });
      setNurse({ ...nurse, ...form });
      setEditing(false);

      // ✅ نحدّث الـ localStorage باش يتحدّث في كل الصفحات
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...form }));

    } catch {
      setMsg({ type: "error", text: "❌ فشل التحديث، حاول مرة أخرى" });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الممرضة؟")) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/api/nurse/${nurseId}`, { method: "DELETE" });
      onNavigate?.("home");
    } catch {
      setMsg({ type: "error", text: "❌ فشل الحذف، حاول مرة أخرى" });
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="np-page" dir="rtl">
      <div className="np-skeleton-hero" />
      <div className="np-skeleton-card" />
      <div className="np-skeleton-card short" />
    </div>
  );

  if (!nurse) return (
    <div className="np-page" dir="rtl">
      <div className="np-error-box">
        <span className="np-error-icon">⚠️</span>
        <p>لم يتم العثور على الممرضة</p>
        <button className="np-btn-back" onClick={() => onNavigate?.("home")}>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  const fields = [
    { icon: "✉️", label: "البريد الإلكتروني", val: nurse.gmail },
    { icon: "🎓", label: "الشهادة",            val: nurse.diplome },
    { icon: "🏥", label: "القسم",               val: nurse.service || "غير محدد" },
    { icon: "👥", label: "الفريق",              val: nurse.equipe  || "غير محدد" },
  ];

  const editFields = [
    { key: "userId",  label: "معرف المستخدم",     type: "text"  },
    { key: "gmail",   label: "البريد الإلكتروني", type: "email" },
    { key: "diplome", label: "الشهادة",            type: "text"  },
    { key: "service", label: "القسم",              type: "text"  },
    { key: "equipe",  label: "الفريق",             type: "text"  },
  ];

  return (
    <div className="np-page" dir="rtl">

      {msg && (
        <div className={`np-toast ${msg.type === "success" ? "success" : "error"}`}>
          {msg.text}
        </div>
      )}

      <button className="np-back-btn" onClick={() => onNavigate?.("home")}>
        ‹ رجوع
      </button>

      <div className="np-hero-card">
        <div className="np-avatar">👩‍⚕️</div>
        <div className="np-hero-info">
          <h2 className="np-hero-name">{nurse.userId || "الممرضة"}</h2>
          <span className="np-hero-badge">{nurse.diplome || "ممرضة"}</span>
        </div>
        <span className="np-status-dot" title="نشطة" />
      </div>

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
            <button className="np-btn edit" onClick={() => setEditing(true)}>✏️ تعديل</button>
            <button className="np-btn delete" onClick={handleDelete} disabled={deleting}>
              {deleting ? "جاري الحذف..." : "🗑️ حذف"}
            </button>
          </div>
        </>
      ) : (
        <div className="np-edit-card">
          <h3 className="np-edit-title">تعديل بيانات الممرضة</h3>
          {editFields.map(({ key, label, type }) => (
            <div key={key} className="np-form-group">
              <label>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
          <div className="np-edit-actions">
            <button className="np-btn save" onClick={handleUpdate} disabled={saving}>
              {saving ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
            </button>
            <button className="np-btn cancel" onClick={() => setEditing(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}