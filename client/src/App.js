import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 🔐 Auth Components
import Login from './login/Login';
import Signup from './auth/Signup';

// 👨‍⚕️ Doctor Interfaces
import DoctorHome from './interfaces/Doctor/DoctorHome';
import DoctorGard from './interfaces/Doctor/DoctorGard';
import DoctorMessage from './interfaces/Doctor/DoctorMessage';
import DoctorProfile from './interfaces/Doctor/DoctorProfile';

// 🛡️ Admin Dashboard
import AdminDashboard from './Admin/AdminDashboard';

// 📂 Admin Management Components (Imports)
import AddDoctor from './Doctor/AddDoctor';
import ManageDoctor from './Doctor/ManageDoctor';
import GetSingleDoctor from './Doctor/GetSingleDoctor';

import AddNurse from './Nurse/AddNurse';
import ManageNurse from './Nurse/ManageNurse';

import AddPharmacist from './pharmacist/AddPharmacist';
import ManagePharmacist from './pharmacist/ManagePharmacist';

import AddFireFighter from './FireFighter/AddFireFighter';
import ManageFireFighter from './FireFighter/ManageFireFighter';
import GetSingleFireFighter from './FireFighter/GetSingleFireFighter';

// ✅ Imports الجداد (Guards, Transactions, Emails)
import AddGarde from './garde/AddGarde';
import ManageGarde from './garde/ManageGarde';
import GetSingleGarde from './garde/GetSingleGarde';

import AddTransaction from './transaction/AddTransaction';
import ManageTransactions from './transaction/ManageTransactions';
import GetSingleTransaction from './transaction/GetSingleTransaction';

import SendEmail from './Email/SendEmail';
import GetSingleEmail from './Email/GetSingleEmail';

import AddMessage from './message/AddMessage';
import ManageMessage from './message/ManageMessage';
import GetSingleMessage from './message/GetSingleMessage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedGardeId, setSelectedGardeId] = useState(null);
  const [selectedNurseId, setSelectedNurseId] = useState(null);
  const [selectedPharmacistId, setSelectedPharmacistId] = useState(null);
  const [selectedFireFighterId, setSelectedFireFighterId] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          setIsLoggedIn(true);
          setCurrentUser(JSON.parse(user));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = '/';
  };

  // ============================================
  // 👑 ADMIN VIEW - WITH NAVIGATION & NEW MODULES
  // ============================================
  const AdminView = () => {
    const [activeModule, setActiveModule] = useState(null);
    const goBack = () => setActiveModule(null);

    // 1. Doctors View
    if (activeModule === 'doctors') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>👨‍⚕️ Manage Doctors</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}><AddDoctor /></section>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><ManageDoctor onSelectDoctor={setSelectedDoctorId} /><GetSingleDoctor doctorId={selectedDoctorId} /></section>
          </div>
        </div>
      );
    }

    // 2. Nurses View
    if (activeModule === 'nurses') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>👩‍⚕️ Manage Nurses</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddNurse /><ManageNurse onSelectNurse={setSelectedNurseId} /></section>
          </div>
        </div>
      );
    }

    // 3. Pharmacists View
    if (activeModule === 'pharmacists') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💊 Manage Pharmacists</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddPharmacist /><ManagePharmacist onSelectPharmacist={setSelectedPharmacistId} /></section>
          </div>
        </div>
      );
    }

    // 4. Firefighters View
    if (activeModule === 'firefighters') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>🚒 Manage Firefighters</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddFireFighter /><ManageFireFighter onSelectFireFighter={setSelectedFireFighterId} /><GetSingleFireFighter fireFighterId={selectedFireFighterId} /></section>
          </div>
        </div>
      );
    }

    // 5. Messages View
    if (activeModule === 'messages') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💬 Manage Messages</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddMessage /><ManageMessage onSelectMessage={setSelectedMessageId} /><GetSingleMessage messageId={selectedMessageId} /></section>
          </div>
        </div>
      );
    }

    // ✅ 6. NEW: Guards View
    if (activeModule === 'guards') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>🛡️ Manage Guards</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <AddGarde />
              <ManageGarde onSelectGarde={setSelectedGardeId} />
              <GetSingleGarde gardeId={selectedGardeId} />
            </section>
          </div>
        </div>
      );
    }

    // ✅ 7. NEW: Transactions View
    if (activeModule === 'transactions') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💰 Manage Transactions</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <AddTransaction />
              <ManageTransactions onSelectTransaction={setSelectedTransactionId} />
              <GetSingleTransaction transactionId={selectedTransactionId} />
            </section>
          </div>
        </div>
      );
    }

    // ✅ 8. NEW: Emails View
    if (activeModule === 'emails') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>📧 Manage Emails</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <SendEmail onEmailSent={setSelectedEmailId} />
              <GetSingleEmail emailId={selectedEmailId} />
            </section>
          </div>
        </div>
      );
    }

    // 🏠 Main Dashboard (Home) - ✅ Added New Cards Here
    return (
      <div className="admin-wrapper">
        <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🛡️ Admin: {currentUser?.email}</span>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '10px' }}>🛡️ Admin Control Panel</h1>
          <p style={{ color: '#666', marginBottom: '40px' }}>Select a module to manage</p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            maxWidth: '1000px', 
            margin: '0 auto' 
          }}>
            {/* Doctors Card */}
            <div onClick={() => setActiveModule('doctors')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} 
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍⚕️</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Doctors</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Add & Manage all doctors</p>
            </div>

            {/* Nurses Card */}
            <div onClick={() => setActiveModule('nurses')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>👩‍⚕️</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Nurses</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Add & Manage all nurses</p>
            </div>

            {/* Pharmacists Card */}
            <div onClick={() => setActiveModule('pharmacists')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>💊</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Pharmacists</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Add & Manage all pharmacists</p>
            </div>

            {/* Firefighters Card */}
            <div onClick={() => setActiveModule('firefighters')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚒</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Firefighters</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Add & Manage all firefighters</p>
            </div>

            {/* Messages Card */}
            <div onClick={() => setActiveModule('messages')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>💬</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Messages</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage all messages</p>
            </div>

            {/* ✅ NEW: Guards Card */}
            <div onClick={() => setActiveModule('guards')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🛡️</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Guards</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage all guards</p>
            </div>

            {/* ✅ NEW: Transactions Card */}
            <div onClick={() => setActiveModule('transactions')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>💰</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Transactions</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage all transactions</p>
            </div>

            {/* ✅ NEW: Emails Card */}
            <div onClick={() => setActiveModule('emails')} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📧</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Emails</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Send & manage emails</p>
            </div>

          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // 👨‍⚕️ DOCTOR VIEW
  // ============================================
  const DoctorView = () => {
    const [view, setView] = useState('home');
    return (
      <div className="doctor-interface-wrapper">
        <div className="user-header" style={{ padding: '15px 30px', background: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>👨‍⚕️ Welcome, {currentUser?.fullName || 'Doctor'}</span>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        {view === 'home' && <DoctorHome onNavigate={setView} />}
        {view === 'garde' && <DoctorGard onNavigate={setView} />}
        {view === 'message' && <DoctorMessage onNavigate={setView} />}
        {view === 'profile' && <DoctorProfile doctorId={currentUser?._id} onNavigate={setView} />}
        
        <div className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
           <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')} style={{ background: view === 'home' ? '#3b82f6' : 'transparent', color: view === 'home' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🏠 Home</button>
           <button className={view === 'garde' ? 'active' : ''} onClick={() => setView('garde')} style={{ background: view === 'garde' ? '#3b82f6' : 'transparent', color: view === 'garde' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🛡️ Garde</button>
           <button className={view === 'message' ? 'active' : ''} onClick={() => setView('message')} style={{ background: view === 'message' ? '#3b82f6' : 'transparent', color: view === 'message' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>💬 Messages</button>
           <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')} style={{ background: view === 'profile' ? '#3b82f6' : 'transparent', color: view === 'profile' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>👤 Profile</button>
        </div>
      </div>
    );
  };

  const NurseView = () => (
    <div className="user-interface-wrapper">
      <div className="user-header" style={{ padding: '15px 30px', background: '#10b981', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>👩‍⚕️ Welcome, {currentUser?.fullName || 'Nurse'}</span>
        <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
      </div>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2>👩‍⚕️ Nurse Dashboard</h2>
        <p>Welcome to your nurse interface</p>
      </div>
    </div>
  );

  const PharmacistView = () => (
    <div className="user-interface-wrapper">
      <div className="user-header" style={{ padding: '15px 30px', background: '#f59e0b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>💊 Welcome, {currentUser?.nomPharmacie || 'Pharmacist'}</span>
        <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
      </div>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2>💊 Pharmacist Dashboard</h2>
        <p>Welcome to your pharmacist interface</p>
      </div>
    </div>
  );

  const FireFighterView = () => (
    <div className="user-interface-wrapper">
      <div className="user-header" style={{ padding: '15px 30px', background: '#ef4444', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🚒 Welcome, {currentUser?.fullName || 'Firefighter'}</span>
        <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
      </div>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2>🚒 Firefighter Dashboard</h2>
        <p>Welcome to your firefighter interface</p>
      </div>
    </div>
  );

  const getDashboard = () => {
    if (!currentUser) return <Navigate to="/" />;
    switch (currentUser.role) {
      case 'admin':       return <AdminView />;
      case 'doctor':      return <DoctorView />;
      case 'nurse':       return <NurseView />;
      case 'pharmacist':  return <PharmacistView />;
      case 'firefighter': return <FireFighterView />;
      default:            return <div>Role not found</div>;
    }
  };

  if (isCheckingAuth) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '20px' }}>⏳ Loading...</div>;

  return (
    <Routes>
      <Route path="/signup" element={!isLoggedIn ? <Signup onSignupSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={isLoggedIn ? getDashboard() : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

export default App;