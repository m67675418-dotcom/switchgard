// DoctorHome.jsx - ✅ Updated: NotificationBell added
import { useState, useEffect } from "react";
import "./DoctorHome.css";
import NotificationBell from "../components/NotificationBell";

const specialties = ["All", "General", "Surgery", "Pediatrics", "Cardiology", "Orthopedics", "Emergency"];
const specialtyIcons = { "All": "🏥", "General": "🩺", "Surgery": "🔬", "Pediatrics": "👶", "Cardiology": "❤️", "Orthopedics": "🦴", "Emergency": "🚑" };

export default function DoctorHome({ onNavigate, currentUser }) {
  const [doctors, setDoctors]           = useState([]);
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/getAll")
      .then(r => r.json())
      .then(data => { setDoctors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d => {
    const matchSearch = d.fullName?.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === "All" || d.specialty === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="container">
      <div className="searchBox">
        {/* ✅ NotificationBell in top-right corner */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <NotificationBell
            userId={currentUser?._id || currentUser?.id}
            role="doctor"
            onNavigate={onNavigate}
          />
        </div>
        <h1>Find a Doctor</h1>
        <p>Search by name or specialty</p>
        <div className="searchInner">
          <span className="searchIcon">🔍</span>
          <input className="searchInput" placeholder="Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mainContent">
        <div className="catScroll">
          {specialties.map(s => (
            <button key={s} className={`catChip ${activeCategory === s ? "catActive" : ""}`} onClick={() => setActiveCategory(s)}>
              <span className="catIcon">{specialtyIcons[s]}</span>
              <span className="catLabel">{s}</span>
            </button>
          ))}
        </div>

        <div className="shortcuts">
          <button className="shortcutBtn" onClick={() => onNavigate?.("message")}><span>💬</span><span>Messages</span></button>
          <button className="shortcutBtn" onClick={() => onNavigate?.("garde")}><span>🛡</span><span>Shifts</span></button>
          {/* ✅ Demandes shortcut */}
          <button className="shortcutBtn" onClick={() => onNavigate?.("demandes")}><span>📤</span><span>Demandes</span></button>
        </div>

        <div className="sectionTitle">
          <h3>Doctors List</h3>
          <span className="count">{filtered.length}</span>
        </div>

        {loading ? (
          <div className="loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty"><span>🔍</span><p>No doctors found</p></div>
        ) : (
          <div className="list">
            {filtered.map(doc => (
              <div key={doc._id} className="card" onClick={() => onNavigate?.("profile", doc._id)}>
                <div className="cardAvatar">🧑‍⚕️</div>
                <div className="cardInfo">
                  <h4 className="cardName">{doc.fullName}</h4>
                  <p className="cardSpec">{doc.specialty}</p>
                  <p className="cardLoc">📍 {doc.location || "Not specified"}</p>
                </div>
                <div className="cardRight">
                  <span className={`badge ${doc.isAvailable ? "badgeGreen" : "badgeRed"}`}>{doc.isAvailable ? "Available" : "Busy"}</span>
                  <span className="arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottomNav">
        <button className="navBtn navActive"><span>🏠</span><span>Home</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("message")}><span>💬</span><span>Messages</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("garde")}><span>🛡</span><span>Shifts</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("map")}><span>🗺️</span><span>Map</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>
    </div>
  );
}