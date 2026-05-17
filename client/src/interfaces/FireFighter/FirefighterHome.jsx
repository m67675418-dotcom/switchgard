import { useState, useEffect } from "react";
import "./FirefighterHome.css";

const grades = ["All", "Sapeur", "Caporal", "Sergent", "Adjudant", "Lieutenant", "Capitaine", "Commandant"];

const gradeIcons = {
  "All": "🚒",
  "Sapeur": "🔹",
  "Caporal": "🔸",
  "Sergent": "⭐",
  "Adjudant": "🎖️",
  "Lieutenant": "👨‍🚒",
  "Capitaine": "👨‍💼",
  "Commandant": "🎯",
};

export default function FirefighterHome({ onNavigate, currentUser }) {
  const [firefighters, setFirefighters] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGrade, setActiveGrade] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/firefighter/getAll")
      .then((r) => r.json())
      .then((data) => {
        setFirefighters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = firefighters.filter((f) => {
    const matchSearch =
      f.matricule?.toLowerCase().includes(search.toLowerCase()) ||
      f.gmail?.toLowerCase().includes(search.toLowerCase()) ||
      f.grade?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeGrade === "All" || f.grade === activeGrade;
    return matchSearch && matchCat;
  });

  return (
    <div className="container">
      <div className="header">
        <div>
          <p className="greeting">Welcome 👋</p>
          <h2 className="title">Available Firefighters</h2>
        </div>
        <button className="profileBtn" onClick={() => onNavigate("profile")}>
          👤
        </button>
      </div>

      <div className="searchBox">
        <span className="searchIcon">🔍</span>
        <input
          className="searchInput"
          placeholder="Search by matricule, email or grade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="catScroll">
        {grades.map((g) => (
          <button
            key={g}
            className={`catChip ${activeGrade === g ? "catActive" : ""}`}
            onClick={() => setActiveGrade(g)}
          >
            <span className="catIcon">{gradeIcons[g]}</span>
            <span className="catLabel">{g}</span>
          </button>
        ))}
      </div>

      <div className="shortcuts">
        <button className="shortcutBtn" onClick={() => onNavigate("messages")}>
          <span>💬</span>
          <span>Messages</span>
        </button>
        <button className="shortcutBtn" onClick={() => onNavigate("garde")}>
          <span>🛡️</span>
          <span>Shifts</span>
        </button>
      </div>

      <div className="sectionTitle">
        <h3>Firefighters List</h3>
        <span className="count">{filtered.length}</span>
      </div>

      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <span>🚒</span>
          <p>No firefighters found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((ff) => (
            <div
              key={ff._id}
              className="card"
              onClick={() => onNavigate("profile", ff._id)}
            >
              <div className="cardAvatar">🚒</div>
              <div className="cardInfo">
                <h4 className="cardName">{ff.matricule || "Firefighter"}</h4>
                <p className="cardSpec">{ff.grade}</p>
                <p className="cardLoc">📍 {ff.uniteIntervention || "Not specified"}</p>
              </div>
              <div className="cardRight">
                <span className="badge badgeRed">{ff.grade || "Grade"}</span>
                <span className="arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottomNav">
        <button className="navBtn navActive" onClick={() => onNavigate("home")}>🏠</button>
        <button className="navBtn" onClick={() => onNavigate("messages")}>💬</button>
        <button className="navBtn" onClick={() => onNavigate("garde")}>🛡️</button>
        <button className="navBtn" onClick={() => onNavigate("profile")}>👤</button>
      </div>
    </div>
  );
}