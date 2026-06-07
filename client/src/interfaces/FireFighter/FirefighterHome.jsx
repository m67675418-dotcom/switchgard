// FirefighterHome.jsx - ✅ Updated: NotificationBell added
import { useState, useEffect } from "react";
import "./FirefighterHome.css";
import NotificationBell from "../components/NotificationBell";

export default function FirefighterHome({ onNavigate, currentUser }) {
  const [items, setItems]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/firefighter/getAll")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="searchBox" style={{ position: "relative" }}>
        {/* ✅ NotificationBell */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <NotificationBell
            userId={currentUser?._id || currentUser?.id}
            role="firefighter"
            onNavigate={onNavigate}
          />
        </div>
        <h1>🚒 Firefighters</h1>
        <p>Find firefighters near you</p>
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
          <h3>Firefighters List</h3>
          <span className="count">{items.length}</span>
        </div>

        {loading ? (
          <div className="loadingWrap">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" />)}</div>
        ) : items.length === 0 ? (
          <div className="empty"><span>🚒</span><p>No firefighters found</p></div>
        ) : (
          <div className="list">
            {items.map((item, idx) => (
              <div key={item._id || idx} className="card" onClick={() => onNavigate?.("profile", item._id)}>
                <div className="cardAvatar">🚒</div>
                <div className="cardInfo">
                  <h4 className="cardName">{item.fullName || item.userId || item.matricule || "N/A"}</h4>
                  <p className="cardSpec">{item.grade || ""}</p>
                  <p className="cardLoc">📍 {item.uniteIntervention || "Not specified"}</p>
                </div>
                <div className="cardRight">
                  <span className="badge badgeGreen">Firefighter</span>
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