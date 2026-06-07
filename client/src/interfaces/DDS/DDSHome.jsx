import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DDSHome = ({ currentUser, onNavigate }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDemandes();
  }, []);

  const fetchPendingDemandes = async () => {
    try {
      console.log('📡 Fetching pending demandes for DDS...');
      const res = await axios.get('http://localhost:5000/api/demande');
      
      console.log('📥 All demandes:', res.data);
      
      // ✅ Filter only pending demandes for director
      const pending = res.data.filter(d => 
        d.directorStatus === 'pending' || !d.directorStatus
      );
      
      console.log('✅ Pending demandes:', pending);
      setDemandes(pending);
    } catch (error) {
      console.error('❌ Error fetching demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (demandeId) => {
    if (!window.confirm('الموافقة على هذا الطلب؟')) return;
    
    try {
      const res = await axios.put(`http://localhost:5000/api/demande/${demandeId}/director-approve`);
      console.log('✅ Approved:', res.data);
      alert('✅ تمت الموافقة!');
      fetchPendingDemandes();
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ خطأ في الموافقة: ' + error.message);
    }
  };

  const handleReject = async (demandeId) => {
    if (!window.confirm('رفض هذا الطلب؟')) return;
    
    try {
      await axios.put(`http://localhost:5000/api/demande/${demandeId}/director-reject`);
      alert('❌ تم رفض الطلب');
      fetchPendingDemandes();
    } catch (error) {
      alert('❌ خطأ في الرفض');
    }
  };

  return (
    <div className="dds-home">
      <h1>👔 DDS Dashboard - الطلبات المعلقة</h1>
      
      {loading ? (
        <p>⏳ جاري التحميل...</p>
      ) : demandes.length === 0 ? (
        <div className="empty-state">
          <p>✅ لا توجد طلبات معلقة</p>
          <p style={{fontSize: '14px', color: '#64748b'}}>
            الطلبات ستظهر هنا بعد موافقة المستخدمين عليها
          </p>
        </div>
      ) : (
        <div className="demandes-list">
          {demandes.map((demande) => (
            <div key={demande._id} className="demande-card">
              <h3>📋 طلب {demande.type === 'vente' ? 'بيع' : 'تبادل'}</h3>
              
              <div className="demande-info">
                <p><strong>المالك الحالي:</strong> {demande.gardeOwner}</p>
                <p><strong>طالب التبديل:</strong> {demande.demandeurName}</p>
                <p><strong>التاريخ:</strong> {new Date(demande.gardeDate).toLocaleDateString()}</p>
                <p><strong>الحالة:</strong> {demande.status}</p>
              </div>

              <div className="actions">
                <button className="btn-approve" onClick={() => handleApprove(demande._id)}>
                  ✅ موافقة
                </button>
                <button className="btn-reject" onClick={() => handleReject(demande._id)}>
                  ❌ رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DDSHome;