// client/src/interfaces/Pharmacist/PharmacistHome.jsx
import { useState, useEffect } from "react";
import "./PharmacistHome.css";

export default function PharmacistHome({ onNavigate, currentUser }) {
  const [items, setItems]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ total: 0, onShift: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/pharmacist/getAll")
        .then(r => r.json())
        .catch(() => []),
      fetch("http://localhost:5000/api/garde/getAll")
        .then(r => r.json())
        .catch(() => []),
      fetch("http://localhost:5000/api/demandes/getAll")
        .then(r => r.json())
        .catch(() => []),
    ]).then(([pharmacists, gardes, demandes]) => {
      const pharmList = Array.isArray(pharmacists) ? pharmacists : [];
      setItems(pharmList);
      setStats({
        total:   pharmList.length,
        onShift: Array.isArray(gardes)   ? gardes.filter(g => g.role === "pharmacist").length   : 0,
        pending: Array.isArray(demandes) ? demandes.filter(d => d.role === "pharmacist" && d.status === "pending").length : 0,
      });
      setLoading(false);
    });
  }, []);

  const filtered = items.filter(i =>
    (i.nomPharmacie || i.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="phmh-container">
      <div className="phmh-search-box">
        <h1>Find a Pharmacist</h1>
        <p>Browse pharmacies</p>
        <div className="phmh-search-inner">
          <span className="phmh-search-icon">🔍</span>
          <input
            className="phmh-search-input"
            placeholder="Search by pharmacy name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="phmh-main-content">
        <div className="phmh-stats">
          <div className="phmh-stat-card">
            <div className="phmh-stat-label">Total Pharmacists</div>
            <div className="phmh-stat-value">{stats.total}</div>
          </div>
          <div className="phmh-stat-card">
            <div className="phmh-stat-label">On Shift</div>
            <div className="phmh-stat-value">{stats.onShift}</div>
          </div>
          <div className="phmh-stat-card">
            <div className="phmh-stat-label">Pending</div>
            <div className="phmh-stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="phmh-section-title">
          <h3>Pharmacists List</h3>
          <span className="phmh-count">{filtered.length}</span>
        </div>

        {loading ? (
          <div className="phmh-loading-wrap">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="phmh-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="phmh-empty">
            <span>💊</span>
            <p>No pharmacists found</p>
          </div>
        ) : (
          <div className="phmh-list">
            {filtered.map((item, idx) => (
              <div
                key={item._id || idx}
                className="phmh-card"
                onClick={() => onNavigate?.("profile", item._id)}
              >
                <div className="phmh-card-avatar">💊</div>
                <div className="phmh-card-info">
                  <h4 className="phmh-card-name">{item.nomPharmacie || item.email || "Unknown"}</h4>
                  <p className="phmh-card-spec">{item.gmail || ""}</p>
                  <p className="phmh-card-loc">📍 {item.adressePharmacie || "Not specified"}</p>
                </div>
                <div className="phmh-card-right">
                  <span className={`phmh-badge ${item.isAvailable ? "phmh-badge-green" : "phmh-badge-red"}`}>
                    {item.isAvailable ? "Available" : "Busy"}
                  </span>
                  <span className="phmh-arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
