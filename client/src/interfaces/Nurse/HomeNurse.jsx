import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserNurse, FaBaby, FaAmbulance, FaProcedures, FaStar } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './HomeNurse.css';

const HomeNurse = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('General');

  const categories = [
    { name: 'General', icon: <FaUserNurse /> },
    { name: 'Pediatrics', icon: <FaBaby /> },
    { name: 'Emergency', icon: <FaAmbulance /> },
    { name: 'ICU', icon: <FaProcedures /> },
  ];

  const nurses = [
    { id: 1, name: 'Nurse Sara Aloui', specialty: 'Emergency Dept', rating: '4.8' },
    { id: 2, name: 'Nurse Amina Benali', specialty: 'Pediatrics', rating: '4.9' },
  ];

  return (
    <div className="home-nurse-container">
      <div className="search-wrapper-nurse">
        <FaSearch className="search-icon-nurse" />
        <input type="text" placeholder="البحث عن زميل ممرض..." />
      </div>

      <section className="section-header">
        <h3>Speciality (Nursing)</h3>
        <div className="category-container-nurse">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              className={`category-item-nurse ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-header">
        <h3>Recommended Nurses</h3>
        <div className="nurses-list">
          {nurses.map((nurse) => (
            <div key={nurse.id} className="nurse-card" onClick={() => navigate('/messages-nurse')}>
              <div className="nurse-avatar">👩‍️</div>
              <div className="nurse-info">
                <h4>{nurse.name}</h4>
                <p>{nurse.specialty} - Available for switch</p>
                <div className="nurse-rating"><FaStar /> <span>{nurse.rating}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Navbar />
    </div>
  );
};

export default HomeNurse;