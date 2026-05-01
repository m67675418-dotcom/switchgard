import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetSingleNurse.css';  // ✅ صحيح: GetSingleNurse.css

const API_BASE = 'http://localhost:5000/api';

const GetSingleNurse = ({ nurseId }) => {  // ✅ صحيح: GetSingleNurse
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nurseId) { 
      setNurse(null); 
      return; 
    }

    const fetchNurse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE}/nurse/${nurseId}`);
        setNurse(response.data.nurse);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNurse();
  }, [nurseId]);

  if (!nurseId) {
    return (
      <div className="nurse-detail-page">
        <div className="nurse-card">
          <p>👩‍⚕️ اضغط على ممرضة لعرض تفاصيلها</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nurse-detail-page">
        <div className="nurse-card">
          <p>⏳ جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nurse-detail-page">
        <div className="nurse-card">
          <p className="error-message">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!nurse) {
    return (
      <div className="nurse-detail-page">
        <div className="nurse-card">
          <p>⚠️ لم يتم العثور على الممرضة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nurse-detail-page">
      <div className="nurse-card">
        <div className="nurse-header">
          <div className="nurse-icon">🩺</div>
          <h2 className="nurse-title">ممرضة #{nurse.id?.slice(-6)}</h2>
          <p className="nurse-diplome">
            <span className="badge diplome">🎓 {nurse.diplome}</span>
          </p>
        </div>
        
        <div className="nurse-info">
          <div className="info-row">
            <span className="info-label">🆔 المعرف</span>
            <span className="info-value">{nurse.id?.slice(-8)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">👤 User ID</span>
            <span className="info-value">{nurse.userId?.slice(-8)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">🎓 الشهادة</span>
            <span className="info-value">{nurse.diplome}</span>
          </div>
          <div className="info-row">
            <span className="info-label">🏥 القسم</span>
            <span className="info-value">{nurse.service}</span>
          </div>
          <div className="info-row">
            <span className="info-label">👥 الفريق</span>
            <span className="info-value">{nurse.equipe}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn secondary" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            ⬆️ للأعلى
          </button>
          <button className="action-btn primary" onClick={() => window.location.reload()}>
            🔄 تحديث
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetSingleNurse;