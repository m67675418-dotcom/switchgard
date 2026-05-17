import { useState, useEffect } from "react";
import "./PharmacistHome.css";

const shiftTypes = ["All", "Day", "Night"];

export default function PharmacistHome({ onNavigate, currentUser }) {
  const [pharmacists, setPharmacists] = useState([]);
  const [search, setSearch] = useState("");
  const [activeShift, setActiveShift] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/pharmacist/getAll")
      .then((r) => r.json())
      .then((data) => {
        setPharmacists(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = pharmacists.filter((p) => {
    const matchSearch =
      p.nomPharmacie?.toLowerCase().includes(search.toLowerCase()) ||
      p.gmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.adressePharmacie?.toLowerCase().includes(search.toLowerCase());
    const matchShift =
      activeShift === "All" ||
      (activeShift === "Night" && p.isNightShift) ||
      (activeShift === "Day" && !p.isNightShift);
    return matchSearch && matchShift;
  });

  return (
    <div className="container">
      <div className="header">
        <div>
          <p className="greeting">Welcome 👋</p>
          <h2 className="title">Available Pharmacies</h2>
        </div>
        <button className="profileBtn" onClick={() => onNavigate("profile")}>
          👤
        </button>
      </div>

      <div className="searchBox">
        <span className="searchIcon">🔍</span>
        <input
          className="searchInput"
          placeholder="Search by name, email or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="catScroll">
        {shiftTypes.map((s) => (
          <button
            key={s}
            className={`catChip ${activeShift === s ? "catActive" : ""}`}
            onClick={() => setActiveShift(s)}
          >
            <span className="catIcon">{s === "All" ? "💊" : s === "Night" ? "🌙" : "☀️"}</span>
            <span className="catLabel">{s}</span>
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
        <h3>Pharmacies List</h3>
        <span className="count">{filtered.length}</span>
      </div>

      {loading ? (
        <div className="loadingWrap">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <span>💊</span>
          <p>No pharmacies found</p>
        </div>
      ) : (
        <div className="list">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="card"
              onClick={() => onNavigate("profile", p._id)}
            >
              <div className="cardAvatar">💊</div>
              <div className="cardInfo">
                <h4 className="cardName">{p.nomPharmacie || "Pharmacist"}</h4>
                <p className="cardSpec">{p.adressePharmacie?.substring(0, 30)}</p>
                <p className="cardLoc">📋 {p.numAgrement || "N/A"}</p>
              </div>
              <div className="cardRight">
                <span className={`badge ${p.isNightShift ? "badgeNight" : "badgeDay"}`}>
                  {p.isNightShift ? "🌙 Night" : "☀️ Day"}
                </span>
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