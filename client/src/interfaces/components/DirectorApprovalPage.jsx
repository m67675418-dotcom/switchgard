import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DirectorApprovalPage.css'; // تأكد من إنشاء الملف

const DirectorApprovalPage = ({ currentUser, onNavigate }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDemandes();
  }, []);

  const fetchPendingDemandes = async () => {
    try {
      // جلب الطلبات اللي directorStatus ديالها pending
      const res = await axios.get('http://localhost:5000/api/demande');
      const pending = res.data.filter(d => d.directorStatus === 'pending');
      setDemandes(pending);
    } catch (error) {
      console.error('Error fetching demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('هل أنت متأكد من الموافقة على هذا الطلب؟ سيتم تبديل الملكية.')) return;
    try {
      await axios.put(`http://localhost:5000/api/demande/${id}/director-approve`);
      alert('✅ تمت الموافقة وتبديل الملكية!');
      fetchPendingDemandes();
    } catch (error) {
      alert('❌ خطأ في الموافقة');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('هل تريد رفض هذا الطلب؟')) return;
    try {
      await axios.put(`http://localhost:5000/api/demande/${id}/director-reject`);
      alert('❌ تم رفض الطلب');
      fetchPendingDemandes();
    } catch (error) {
      alert('❌ خطأ في الرفض');
    }
  };

  return (
    <div className="director-page">
      <button className="back-btn" onClick={() => onNavigate?.('home')}>← رجوع</button>
      
      <div className="header">
        <h1>📋 طلبات التبديل/البيع المعلقة</h1>
        <p>مراجعة والتحقق من الطلبات قبل الموافقة النهائية</p>
      </div>

      {loading ? (
        <div className="loading">⏳ جاري التحميل...</div>
      ) : demandes.length === 0 ? (
        <div className="empty">✅ لا توجد طلبات معلقة حالياً</div>
      ) : (
        <div className="demandes-grid">
          {demandes.map((d) => (
            <div key={d._id} className="demande-card">
              
              {/* معلومات المناوبة */}
              <div className="garde-info">
                <h3>🛡️ تفاصيل المناوبة</h3>
                <p><strong>التاريخ:</strong> {new Date(d.gardeDate).toLocaleDateString()}</p>
                <p><strong>النوع:</strong> {d.type === 'vente' ? '💰 بيع' : ' تبادل'}</p>
              </div>

              {/* مقارنة بين الطرفين */}
              <div className="users-comparison">
                <div className="user-col owner">
                  <h4> المالك الحالي (User A)</h4>
                  <p><strong>الاسم:</strong> {d.gardeOwner}</p>
                  <p><strong>المعرف:</strong> {d.proprietaireId?.slice(-6)}</p>
                </div>
                
                <div className="arrow">➡️</div>

                <div className="user-col new-owner">
                  <h4>👤 المالك الجديد (User B)</h4>
                  <p><strong>الاسم:</strong> {d.demandeurName}</p>
                  <p><strong>المعرف:</strong> {d.demandeurId?.slice(-6)}</p>
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="actions">
                <button className="btn-approve" onClick={() => handleApprove(d._id)}>
                  ✅ Valider (موافقة)
                </button>
                <button className="btn-reject" onClick={() => handleReject(d._id)}>
                  ❌ Rejeter (رفض)
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorApprovalPage;