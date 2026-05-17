// NurseHome.jsx
import { useState, useEffect } from "react";
import "./NurseHome.css";

const services = ["All", "IDE", "ISP"];
const serviceIcons = { "All": "🏥", "IDE": "🩺", "ISP": "💊" };

export default function NurseHome({ onNavigate }) {
  const [nurses, setNurses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeService, setActiveService] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/nurse/getAll")
      .then((r) => r.json())
      .then((data) => {
        setNurses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = nurses.filter((n) => {
    const matchSearch =
      n.userId?.toLowerCase().includes(search.toLowerCase()) ||
      n.gmail?.toLowerCase().includes(search.toLowerCase()) ||
      n.diplome?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeService === "All" || n.diplome === activeService;
    return matchSearch && matchCat;
  });

  return (
    <div className="container">
      <div className="header">
        <div>
          <p className="greeting">Welcome 👋</p>
          <h2 className="title">Available Nurses</h2>
        </div>
        <button className="profileBtn" onClick={() => onNavigate?.("profile")}>
          👤
        </button>
      </div>

      <div className="searchBox">
        <span className="searchIcon">🔍</span>
        <input
          className="searchInput"
          placeholder="Search by name, email or diploma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="catScroll">
        {services.map((s) => (
          <button
            key={s}
            className={`catChip ${activeService === s ? "catActive" : ""}`}
            onClick={() => setActiveService(s)}
          >
            <span className="catIcon">{serviceIcons[s]}</span>
            <span className="catLabel">{s}</span>
          </button>
        ))}
      </div>

      <div className="shortcuts">
        <button className="shortcutBtn" onClick={() => onNavigate?.("messages")}>
          <span>💬</span>
          <span>Messages</span>
        </button>
        <button className="shortcutBtn" onClick={() => onNavigate?.("garde")}>
          <span>🛡️</span>
          <span>Shifts</span>
        </button>
      </div>

      <div className="sectionTitle">
        <h3>Nurses List</h3>
        <span className="count">{filtered.length}</span>
      </div>

      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <span>🩺</span>
          <p>No nurses found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((nurse) => (
            <div
              key={nurse._id}
              className="card"
              // ✅ نعدّي nurse._id كـ argument ثاني لـ handleNavigate في App.js
              onClick={() => onNavigate?.("profile", nurse._id)}
            >
              <div className="cardAvatar">👩‍⚕️</div>
              <div className="cardInfo">
                <h4 className="cardName">{nurse.userId || "Nurse"}</h4>
                <p className="cardSpec">{nurse.diplome}</p>
                <p className="cardLoc">📍 {nurse.service || "Not specified"}</p>
              </div>
              <div className="cardRight">
                <span className={`badge ${nurse.diplome ? "badgeGreen" : "badgeRed"}`}>
                  {nurse.diplome || "IDE"}
                </span>
                <span className="arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottomNav">
        <button className="navBtn navActive" onClick={() => onNavigate?.("home")}>🏠</button>
        <button className="navBtn" onClick={() => onNavigate?.("messages")}>💬</button>
        <button className="navBtn" onClick={() => onNavigate?.("garde")}>🛡️</button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}>👤</button>
      </div>
    </div>
  );
}