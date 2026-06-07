import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './login/Login';
import Signup from './auth/Signup';

import DoctorHome    from './interfaces/Doctor/DoctorHome';
import DoctorGard    from './interfaces/Doctor/DoctorGard';
import DoctorMessage from './interfaces/Doctor/DoctorMessage';
import DoctorProfile from './interfaces/Doctor/DoctorProfile';

import AdminDashboard from './Admin/AdminDashboard';

import AddDoctor       from './Doctor/AddDoctor';
import ManageDoctor    from './Doctor/ManageDoctor';
import GetSingleDoctor from './Doctor/GetSingleDoctor';

import AddNurse    from './Nurse/AddNurse';
import ManageNurse from './Nurse/ManageNurse';

import AddPharmacist    from './pharmacist/AddPharmacist';
import ManagePharmacist from './pharmacist/ManagePharmacist';

import AddFireFighter       from './FireFighter/AddFireFighter';
import ManageFireFighter    from './FireFighter/ManageFireFighter';
import GetSingleFireFighter from './FireFighter/GetSingleFireFighter';

import NurseHome    from './interfaces/Nurse/NurseHome';
import NurseGarde   from './interfaces/Nurse/NurseGarde';
import NurseMessage from './interfaces/Nurse/NurseMessage';
import NurseProfile from './interfaces/Nurse/NurseProfile';

import FirefighterHome    from './interfaces/FireFighter/FirefighterHome';
import FirefighterGarde   from './interfaces/FireFighter/FirefighterGarde';
import FirefighterMessage from './interfaces/FireFighter/FirefighterMessage';
import FirefighterProfile from './interfaces/FireFighter/FirefighterProfile';

import PharmacistHome    from './interfaces/Pharmacist/PharmacistHome';
import PharmacistGarde   from './interfaces/Pharmacist/PharmacistGarde';
import PharmacistMessage from './interfaces/Pharmacist/PharmacistMessage';
import PharmacistProfile from './interfaces/Pharmacist/PharmacistProfile';

import AddGarde       from './garde/AddGarde';
import ManageGarde    from './garde/ManageGarde';
import GetSingleGarde from './garde/GetSingleGarde';

import AddTransaction       from './transaction/AddTransaction';
import ManageTransactions   from './transaction/ManageTransactions';
import GetSingleTransaction from './transaction/GetSingleTransaction';

import SendEmail      from './Email/SendEmail';
import GetSingleEmail from './Email/GetSingleEmail';

import AddMessage       from './message/AddMessage';
import ManageMessage    from './message/ManageMessage';
import GetSingleMessage from './message/GetSingleMessage';

// ✅ MAP
import MapPage from './interfaces/components/MapPage';

// ✅ Garde Exchange System
import DemandesPage        from './interfaces/components/DemandesPage';
import DirectorApprovalPage from './interfaces/components/DirectorApprovalPage';

// ✅ DDS Components
import DDSHome from './interfaces/DDS/DDSHome';
import DDSGarde from './interfaces/DDS/DDSGarde';
import DDSMessage from './interfaces/DDS/DDSMessage';
import DDSProfile from './interfaces/DDS/DDSProfile';
import AddDDS from './DDS/AddDDS';
import ManageDDS from './DDS/ManageDDS';
import GetSingleDDS from './DDS/GetSingleDDS';

function App() {
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [currentUser, setCurrentUser]       = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [selectedDoctorId, setSelectedDoctorId]           = useState(null);
  const [selectedMessageId, setSelectedMessageId]         = useState(null);
  const [selectedGardeId, setSelectedGardeId]             = useState(null);
  const [selectedNurseId, setSelectedNurseId]             = useState(null);
  const [selectedPharmacistId, setSelectedPharmacistId]   = useState(null);
  const [selectedFireFighterId, setSelectedFireFighterId] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedEmailId, setSelectedEmailId]             = useState(null);
  const [selectedDDSId, setSelectedDDSId]                 = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      try {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(user));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    const enriched = {
      ...userData,
      displayName:
        userData.fullName ||
        userData.nomPharmacie ||
        userData.userId ||
        userData.matricule ||
        userData.email,
    };
    setCurrentUser(enriched);
    localStorage.setItem('user', JSON.stringify(enriched));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = '/';
  };

  const handleUpdateUser = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  // ── Top bar helper ──
  const topBarStyle = (bg, btnBg) => ({
    bar: {
      padding: '0 48px', height: '52px', background: bg, color: 'white',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: '14px', fontWeight: '600', position: 'sticky', top: 0, zIndex: 300, width: '100%',
    },
    btn: {
      background: btnBg, color: 'white', border: 'none', padding: '7px 16px',
      borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
    },
  });

  // ============================================================
  // 👑 ADMIN VIEW
  // ============================================================
  const AdminView = () => {
    const [activeModule, setActiveModule] = useState(null);
    const goBack = () => setActiveModule(null);
    const s = topBarStyle('#1e3a8a', '#dc2626');

    const AdminBar = ({ extraLeft }) => (
      <div style={s.bar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {extraLeft}
          <span>🛡️ Admin: {currentUser?.email}</span>
        </div>
        <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
      </div>
    );

    const backBtn = (
      <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 14px', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}>
        ← Back
      </button>
    );

    const moduleContent = {
      doctors:      { title: '👨‍⚕️ Manage Doctors',     children: <><AddDoctor /><ManageDoctor onSelectDoctor={setSelectedDoctorId} /><GetSingleDoctor doctorId={selectedDoctorId} /></> },
      nurses:       { title: '👩‍⚕️ Manage Nurses',      children: <><AddNurse /><ManageNurse onSelectNurse={setSelectedNurseId} /></> },
      pharmacists:  { title: '💊 Manage Pharmacists',  children: <><AddPharmacist /><ManagePharmacist onSelectPharmacist={setSelectedPharmacistId} /></> },
      firefighters: { title: '🚒 Manage Firefighters', children: <><AddFireFighter /><ManageFireFighter onSelectFireFighter={setSelectedFireFighterId} /><GetSingleFireFighter fireFighterId={selectedFireFighterId} /></> },
      dds:          { title: '👔 Manage DDS',          children: <><AddDDS /><ManageDDS onSelectDDS={setSelectedDDSId} /><GetSingleDDS ddsId={selectedDDSId} /></> },
      messages:     { title: '💬 Manage Messages',     children: <><AddMessage /><ManageMessage onSelectMessage={setSelectedMessageId} /><GetSingleMessage messageId={selectedMessageId} /></> },
      guards:       { title: '🛡️ Manage Guards',       children: <><AddGarde /><ManageGarde onSelectGarde={setSelectedGardeId} /><GetSingleGarde gardeId={selectedGardeId} /></> },
      transactions: { title: '💰 Manage Transactions', children: <><AddTransaction /><ManageTransactions onSelectTransaction={setSelectedTransactionId} /><GetSingleTransaction transactionId={selectedTransactionId} /></> },
      emails:       { title: '📧 Manage Emails',       children: <><SendEmail onEmailSent={setSelectedEmailId} /><GetSingleEmail emailId={selectedEmailId} /></> },
      map:          { title: '🗺️ Map',                 children: <MapPage onNavigate={() => setActiveModule(null)} currentUser={currentUser} role="doctor" /> },
    };

    if (activeModule && moduleContent[activeModule]) {
      const { title, children } = moduleContent[activeModule];
      return (
        <div className="admin-wrapper">
          <AdminBar extraLeft={backBtn} />
          <div style={{ padding: '36px 48px', maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', color: '#1e3a8a' }}>{title}</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              {children}
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-wrapper">
        <AdminBar />
        <div style={{ padding: '48px', maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '8px', color: '#0f172a' }}>Admin Control Panel</h1>
          <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>Select a module to manage</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { key: 'doctors',      icon: '👨‍⚕️', title: 'Doctors',      desc: 'Add & Manage doctors' },
              { key: 'nurses',       icon: '👩‍⚕️', title: 'Nurses',       desc: 'Add & Manage nurses' },
              { key: 'pharmacists',  icon: '💊',   title: 'Pharmacists',  desc: 'Add & Manage pharmacists' },
              { key: 'firefighters', icon: '🚒',   title: 'Firefighters', desc: 'Add & Manage firefighters' },
              { key: 'dds',          icon: '👔',   title: 'DDS',          desc: 'Add & Manage directors' },
              { key: 'messages',     icon: '💬',   title: 'Messages',     desc: 'Manage all messages' },
              { key: 'guards',       icon: '🛡️',   title: 'Guards',       desc: 'Manage all guards' },
              { key: 'transactions', icon: '💰',   title: 'Transactions', desc: 'Manage transactions' },
              { key: 'emails',       icon: '📧',   title: 'Emails',       desc: 'Send & manage emails' },
              { key: 'map',          icon: '🗺️',   title: 'Map',          desc: 'View all locations' },
            ].map(({ key, icon, title, desc }) => (
              <div
                key={key}
                onClick={() => setActiveModule(key)}
                style={{ background: 'white', padding: '28px 24px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1.5px solid #e2e8f0' }}
                onMouseOver={e  => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.14)'; }}
                onMouseOut={e   => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>{icon}</div>
                <h3 style={{ margin: '0 0 8px', color: '#1e3a8a', fontSize: '16px' }}>{title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // 👨‍⚕️ DOCTOR VIEW
  // ============================================================
  const DoctorView = () => {
    const [view, setView]         = useState('home');
    const [profileId, setProfileId] = useState(currentUser?.id || null);
    const s = topBarStyle('#1e5ce2', '#0c26d0');

    const handleNavigate = (newView, id = null) => {
      if (id) setProfileId(id);
      setView(newView);
    };

    return (
      <div className="doctor-interface-wrapper">
        <div style={s.bar}>
          <span>👨‍⚕️ Welcome, {currentUser?.fullName || 'Doctor'}</span>
          <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
        </div>
        {view === 'home'      && <DoctorHome     onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'     && <DoctorGard     onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'message'   && <DoctorMessage  onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'map'       && <MapPage        onNavigate={handleNavigate} currentUser={currentUser} role="doctor" />}
        {view === 'profile'   && <DoctorProfile  doctorId={profileId || currentUser?.id} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
        {view === 'demandes'  && <DemandesPage        currentUser={currentUser} role="doctor"  onNavigate={handleNavigate} />}
        {view === 'director'  && <DirectorApprovalPage currentUser={currentUser} role="doctor"  onNavigate={handleNavigate} />}
      </div>
    );
  };

  // ============================================================
  // 👩‍⚕️ NURSE VIEW
  // ============================================================
  const NurseView = () => {
    const [view, setView]       = useState('home');
    const [nurseId, setNurseId] = useState(currentUser?.id || null);
    const s = topBarStyle('#50b59a', '#096842');

    const handleNavigate = (newView, id = null) => {
      if (id) setNurseId(id);
      setView(newView);
    };

    return (
      <div className="nurse-interface-wrapper">
        <div style={s.bar}>
          <span>👩‍⚕️ Welcome, {currentUser?.userId || 'Nurse'}</span>
          <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
        </div>
        {view === 'home'      && <NurseHome    onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'     && <NurseGarde   onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'messages'  && <NurseMessage onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'map'       && <MapPage      onNavigate={handleNavigate} currentUser={currentUser} role="nurse" />}
        {view === 'profile'   && <NurseProfile nurseId={nurseId || currentUser?.id} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
        {view === 'demandes'  && <DemandesPage         currentUser={currentUser} role="nurse" onNavigate={handleNavigate} />}
        {view === 'director'  && <DirectorApprovalPage currentUser={currentUser} role="nurse" onNavigate={handleNavigate} />}
      </div>
    );
  };

  // ============================================================
  // 💊 PHARMACIST VIEW
  // ============================================================
  const PharmacistView = () => {
    const [view, setView] = useState('home');
    const s = topBarStyle('#059669', '#116b18');

    const handleNavigate = (newView, id = null) => setView(newView);

    return (
      <div className="pharmacist-interface-wrapper">
        <div style={s.bar}>
          <span>💊 Welcome, {currentUser?.nomPharmacie || 'Pharmacist'}</span>
          <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
        </div>
        {view === 'home'      && <PharmacistHome    onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'     && <PharmacistGarde   onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'messages'  && <PharmacistMessage onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'map'       && <MapPage           onNavigate={handleNavigate} currentUser={currentUser} role="pharmacist" />}
        {view === 'profile'   && <PharmacistProfile pharmacistId={currentUser?.id} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
        {view === 'demandes'  && <DemandesPage         currentUser={currentUser} role="pharmacist" onNavigate={handleNavigate} />}
        {view === 'director'  && <DirectorApprovalPage currentUser={currentUser} role="pharmacist" onNavigate={handleNavigate} />}
      </div>
    );
  };

  // ============================================================
  // 🚒 FIREFIGHTER VIEW
  // ============================================================
  const FirefighterView = () => {
    const [view, setView] = useState('home');
    const s = topBarStyle('#ef4444', '#dc2626');

    const handleNavigate = (newView, id = null) => setView(newView);

    return (
      <div className="firefighter-interface-wrapper">
        <div style={s.bar}>
          <span>🚒 Welcome, {currentUser?.matricule || currentUser?.userId || 'Firefighter'}</span>
          <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
        </div>
        {view === 'home'      && <FirefighterHome    onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'     && <FirefighterGarde   onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'messages'  && <FirefighterMessage onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'map'       && <MapPage            onNavigate={handleNavigate} currentUser={currentUser} role="firefighter" />}
        {view === 'profile'   && <FirefighterProfile firefighterId={currentUser?.id} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
        {view === 'demandes'  && <DemandesPage         currentUser={currentUser} role="firefighter" onNavigate={handleNavigate} />}
        {view === 'director'  && <DirectorApprovalPage currentUser={currentUser} role="firefighter" onNavigate={handleNavigate} />}
      </div>
    );
  };

  // ============================================================
  // 👔 DDS VIEW (NEW)
  // ============================================================
  const DDSView = () => {
    const [view, setView] = useState('home');
    const [ddsId, setDdsId] = useState(currentUser?.id || null);
    const s = topBarStyle('#6b21a8', '#581c87');

    const handleNavigate = (newView, id = null) => {
      if (id) setDdsId(id);
      setView(newView);
    };

    return (
      <div className="dds-interface-wrapper">
        <div style={s.bar}>
          <span>👔 Welcome, {currentUser?.fullName || 'DDS'}</span>
          <button style={s.btn} onClick={handleLogout}>Logout 🚪</button>
        </div>
        {view === 'home'      && <DDSHome    onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'     && <DDSGarde   onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'messages'  && <DDSMessage onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'map'       && <MapPage    onNavigate={handleNavigate} currentUser={currentUser} role="dds" />}
        {view === 'profile'   && <DDSProfile ddsId={ddsId || currentUser?.id} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
        {view === 'demandes'  && <DemandesPage         currentUser={currentUser} role="dds" onNavigate={handleNavigate} />}
        {view === 'director'  && <DirectorApprovalPage currentUser={currentUser} role="dds" onNavigate={handleNavigate} />}
      </div>
    );
  };

  const getDashboard = () => {
    if (!currentUser) return <Navigate to="/" />;
    switch (currentUser.role) {
      case 'admin':       return <AdminView />;
      case 'doctor':      return <DoctorView />;
      case 'nurse':       return <NurseView />;
      case 'pharmacist':  return <PharmacistView />;
      case 'firefighter': return <FirefighterView />;
      case 'dds':         return <DDSView />;
      default:            return <div>Role not found</div>;
    }
  };

  if (isCheckingAuth) return (
    <div style={{ padding: '50px', textAlign: 'center', fontSize: '20px' }}>⏳ Loading...</div>
  );

  return (
    <Routes>
      <Route path="/signup"    element={!isLoggedIn ? <Signup onSignupSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
      <Route path="/"          element={!isLoggedIn ? <Login  onLoginSuccess={handleLoginSuccess}  /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={isLoggedIn  ? getDashboard() : <Navigate to="/" />} />
      <Route path="*"          element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

export default App;