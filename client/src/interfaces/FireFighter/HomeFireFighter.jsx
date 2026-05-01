// HomeFireFighter.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFire, FaAmbulance, FaShieldAlt, FaFirstAid, FaStar } from 'react-icons/fa';
import './HomeFireFighter.css';

const HomeFireFighter = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = [
    { name: 'General', icon: <FaFire /> },
    { name: 'Rescue', icon: <FaAmbulance /> },
    { name: 'Security', icon: <FaShieldAlt /> },
    { name: 'First Aid', icon: <FaFirstAid /> },
  ];

  const fighters = [
    { id: 1, name: 'Lt. Ahmed Boudiaf', specialty: 'Fire & Rescue', rating: '4.9' },
    { id: 2, name: 'Sgt. Khalid Merzak', specialty: 'Emergency Response', rating: '4.7' },
  ];

  return (
    <div className="home-ff-container">
      <div className="search-wrapper">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search firefighter, units..." />
      </div>

      <section className="section-header">
        <h3>Unit Speciality</h3>
        <div className="category-container">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-header">
        <h3>Available Units</h3>
        <div className="ff-list">
          {fighters.map((p) => (
            <div key={p.id} className="ff-card" onClick={() => navigate('/messages-firefighter')}>
              <div className="ff-avatar">🚒</div>
              <div className="ff-info">
                <h4>{p.name}</h4>
                <p>{p.specialty}</p>
                <div className="rating-badge"><FaStar /> {p.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeFireFighter;