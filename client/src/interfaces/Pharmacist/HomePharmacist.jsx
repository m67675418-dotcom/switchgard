import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './HomePharmacist.css';

const HomePharmacist = () => {
  const navigate = useNavigate();

  const pharmacists = [
    { id: 1, name: 'Ph. Karim Benali', specialty: 'Clinical Pharmacist', rating: '4.8' },
    { id: 2, name: 'Ph. Sara Messaoudi', specialty: 'Hospital Pharmacist', rating: '4.6' },
    { id: 3, name: 'Ph. Youcef Hadj', specialty: 'Pediatric Pharmacist', rating: '4.9' },
  ];

  return (
    <div className="home-pharmacy-container">
      <header className="pharmacy-header">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search pharmacist, drugs..." />
        </div>
      </header>

      <section className="doctors-section">
        <h3>Available Pharmacists</h3>
        <div className="doctors-list">
          {pharmacists.map((ph) => (
            <div key={ph.id} className="doctor-card" onClick={() => navigate('/messages-pharmacy')}>
              <div className="doctor-avatar">💊</div>
              <div className="doctor-info">
                <h4>{ph.name}</h4>
                <p>{ph.specialty}</p>
                <div className="rating-badge"><FaStar /> {ph.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Navbar />
    </div>
  );
};

export default HomePharmacist;