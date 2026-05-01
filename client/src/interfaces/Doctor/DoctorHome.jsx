import { useState, useEffect } from "react";
import "./DoctorHome.css"; // Changé de .module.css à .css

const specialties = ["All", "General", "Surgery", "Pediatrics", "Cardiology", "Orthopedics", "Emergency"];

const specialtyIcons = {
  "All": "🏥",
  "General": "🩺",
  "Surgery": "🔬",
  "Pediatrics": "👶",
  "Cardiology": "❤️",
  "Orthopedics": "🦴",
  "Emergency": "🚑",
};

export default function DoctorHome({ onNavigate }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/Doctor/getAll")
      .then((r) => r.json())
      .then((data) => {
        setDoctors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch = 
      d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "All" || d.specialty === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <div>
          <p className="greeting">Welcome 👋</p>
          <h2 className="title">Available Doctors</h2>
        </div>
        <button className="profileBtn" onClick={() => onNavigate?.("profile")}>
          👤
        </button>
      </div>

      {/* Search */}
      <div className="searchBox">
        <span className="searchIcon">🔍</span>
        <input
          className="searchInput"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="catScroll">
        {specialties.map((s) => (
          <button
            key={s}
            className={`catChip ${activeCategory === s ? "catActive" : ""}`}
            onClick={() => setActiveCategory(s)}
          >
            <span className="catIcon">{specialtyIcons[s]}</span>
            <span className="catLabel">{s}</span>
          </button>
        ))}
      </div>

      {/* Shortcuts */}
      <div className="shortcuts">
        <button className="shortcutBtn" onClick={() => onNavigate?.("messages")}>
          <span>💬</span>
          <span>Messages</span>
        </button>
        <button className="shortcutBtn" onClick={() => onNavigate?.("garde")}>
          <span>🛡</span>
          <span>Shifts</span>
        </button>
      </div>

      {/* Section Title */}
      <div className="sectionTitle">
        <h3>Doctors List</h3>
        <span className="count">{filtered.length}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <span>🔍</span>
          <p>No doctors found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((doc) => (
            <div
              key={doc._id}
              className="card"
              onClick={() => onNavigate?.("profile", doc._id)}
            >
              <div className="cardAvatar">🧑‍⚕️</div>
              <div className="cardInfo">
                <h4 className="cardName">{doc.fullName}</h4>
                <p className="cardSpec">{doc.specialty}</p>
                <p className="cardLoc">📍 {doc.location || "Not specified"}</p>
              </div>
              <div className="cardRight">
                <span className={`badge ${doc.isAvailable ? "badgeGreen" : "badgeRed"}`}>
                  {doc.isAvailable ? "Available" : "Busy"}
                </span>
                <span className="arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="bottomNav">
        <button className="navBtn navActive">🏠</button>
        <button className="navBtn" onClick={() => onNavigate?.("messages")}>💬</button>
        <button className="navBtn" onClick={() => onNavigate?.("garde")}>🛡</button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}>👤</button>
      </div>

    </div>
  );
}