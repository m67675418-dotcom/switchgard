// NurseHome.jsx - ✅ Updated: NotificationBell added
import { useState, useEffect } from "react";
import "./NurseHome.css";
import NotificationBell from "../components/NotificationBell";

export default function NurseHome({ onNavigate, currentUser }) {
  const [items, setItems]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/nurse/getAll")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(i =>
    (i.userId || i.gmail || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="searchBox" style={{ position: "relative" }}>
        {/* ✅ NotificationBell */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <NotificationBell
            userId={currentUser?._id || currentUser?.id}
            role="nurse"
            onNavigate={onNavigate}
          />
        </div>
        <h1>👩‍⚕️ Nurses</h1>
        <p>Find nurses near you</p>
        <div className="searchInner">
          <span className="searchIcon">🔍</span>
          <input className="searchInput" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mainContent">
        <div className="shortcuts">
          <button className="shortcutBtn" onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
          <button className="shortcutBtn" onClick={() => onNavigate?.("garde")}><span>🛡️</span><span>Shifts</span></button>
          {/* ✅ Demandes shortcut */}
          <button className="shortcutBtn" onClick={() => onNavigate?.("demandes")}><span>📤</span><span>Demandes</span></button>
        </div>

        <div className="sectionTitle">
          <h3>Nurses List</h3>
          <span className="count">{filtered.length}</span>
        </div>

        {loading ? (
          <div className="loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty"><span>👩‍⚕️</span><p>No nurses found</p></div>
        ) : (
          <div className="list">
            {filtered.map((item, idx) => (
              <div key={item._id || idx} className="card" onClick={() => onNavigate?.("profile", item._id)}>
                <div className="cardAvatar">👩‍⚕️</div>
                <div className="cardInfo">
                  <h4 className="cardName">{item.fullName || item.userId || item.nomPharmacie || item.matricule || "N/A"}</h4>
                  <p className="cardSpec">{item.specialty || item.diplome || item.grade || ""}</p>
                  <p className="cardLoc">📍 {item.location || item.service || item.adressePharmacie || item.uniteIntervention || "Not specified"}</p>
                </div>
                <div className="cardRight">
                  <span className="badge badgeGreen">Nurse</span>
                  <span className="arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottomNav">
        <button className="navBtn navActive"><span>🏠</span><span>Home</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("messages")}><span>💬</span><span>Messages</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("garde")}><span>🛡️</span><span>Shifts</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("map")}><span>🗺️</span><span>Map</span></button>
        <button className="navBtn" onClick={() => onNavigate?.("profile")}><span>👤</span><span>Profile</span></button>
      </div>
    </div>
  );
}