import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './login/Login';
import Signup from './auth/Signup';

import DoctorHome from './interfaces/Doctor/DoctorHome';
import DoctorGard from './interfaces/Doctor/DoctorGard';
import DoctorMessage from './interfaces/Doctor/DoctorMessage';
import DoctorProfile from './interfaces/Doctor/DoctorProfile';

import AdminDashboard from './Admin/AdminDashboard';

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

import NurseHome from './interfaces/Nurse/NurseHome';
import NurseGarde from './interfaces/Nurse/NurseGarde';
import NurseMessage from './interfaces/Nurse/NurseMessage';
import NurseProfile from './interfaces/Nurse/NurseProfile';

import FirefighterHome from './interfaces/FireFighter/FirefighterHome';
import FirefighterGarde from './interfaces/FireFighter/FirefighterGarde';
import FirefighterMessage from './interfaces/FireFighter/FirefighterMessage';
import FirefighterProfile from './interfaces/FireFighter/FirefighterProfile';

import PharmacistHome from './interfaces/Pharmacist/PharmacistHome';
import PharmacistGarde from './interfaces/Pharmacist/PharmacistGarde';
import PharmacistMessage from './interfaces/Pharmacist/PharmacistMessage';
import PharmacistProfile from './interfaces/Pharmacist/PharmacistProfile';

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
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
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
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = '/';
  };

  // ✅ دالة تحديث الـ currentUser في الـ state والـ localStorage معاً
  const handleUpdateUser = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  // ============================================
  // 👑 ADMIN VIEW
  // ============================================
  const AdminView = () => {
    const [activeModule, setActiveModule] = useState(null);
    const goBack = () => setActiveModule(null);

    if (activeModule === 'doctors') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button>
              <span>🛡️ Admin: {currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} style={{ background: '#1732e2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>👨‍⚕️ Manage Doctors</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}><AddDoctor /></section>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><ManageDoctor onSelectDoctor={setSelectedDoctorId} /><GetSingleDoctor doctorId={selectedDoctorId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'nurses') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#5cf1db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>👩‍⚕️ Manage Nurses</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddNurse /><ManageNurse onSelectNurse={setSelectedNurseId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'pharmacists') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#26dc4e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💊 Manage Pharmacists</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddPharmacist /><ManagePharmacist onSelectPharmacist={setSelectedPharmacistId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'firefighters') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#e21212', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>🚒 Manage Firefighters</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddFireFighter /><ManageFireFighter onSelectFireFighter={setSelectedFireFighterId} /><GetSingleFireFighter fireFighterId={selectedFireFighterId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'messages') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#4d3838', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💬 Manage Messages</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddMessage /><ManageMessage onSelectMessage={setSelectedMessageId} /><GetSingleMessage messageId={selectedMessageId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'guards') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#6d6262', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>🛡️ Manage Guards</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddGarde /><ManageGarde onSelectGarde={setSelectedGardeId} /><GetSingleGarde gardeId={selectedGardeId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'transactions') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#f0ed26', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>💰 Manage Transactions</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><AddTransaction /><ManageTransactions onSelectTransaction={setSelectedTransactionId} /><GetSingleTransaction transactionId={selectedTransactionId} /></section>
          </div>
        </div>
      );
    }
    if (activeModule === 'emails') {
      return (
        <div className="admin-wrapper">
          <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><button onClick={goBack} style={{ marginRight: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>← Back to Menu</button><span>🛡️ Admin: {currentUser?.email}</span></div>
            <button onClick={handleLogout} style={{ background: '#312b2b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
          </div>
          <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>📧 Manage Emails</h2>
            <section style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}><SendEmail onEmailSent={setSelectedEmailId} /><GetSingleEmail emailId={selectedEmailId} /></section>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-wrapper">
        <div className="logout-bar" style={{ padding: '15px 30px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🛡️ Admin: {currentUser?.email}</span>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '10px' }}>Admin Control Panel</h1>
          <p style={{ color: '#666', marginBottom: '40px' }}>Select a module to manage</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { key: 'doctors',      icon: '👨‍⚕️', title: 'Doctors',      desc: 'Add & Manage all doctors' },
              { key: 'nurses',       icon: '👩‍⚕️', title: 'Nurses',       desc: 'Add & Manage all nurses' },
              { key: 'pharmacists',  icon: '💊',   title: 'Pharmacists',  desc: 'Add & Manage all pharmacists' },
              { key: 'firefighters', icon: '🚒',   title: 'Firefighters', desc: 'Add & Manage all firefighters' },
              { key: 'messages',     icon: '💬',   title: 'Messages',     desc: 'Manage all messages' },
              { key: 'guards',       icon: '🛡️',   title: 'Guards',       desc: 'Manage all guards' },
              { key: 'transactions', icon: '💰',   title: 'Transactions', desc: 'Manage all transactions' },
              { key: 'emails',       icon: '📧',   title: 'Emails',       desc: 'Send & manage emails' },
            ].map(({ key, icon, title, desc }) => (
              <div key={key} onClick={() => setActiveModule(key)}
                style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{icon}</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>{title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{desc}</p>
              </div>
            ))}
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
        <div className="user-header" style={{ padding: '15px 30px', background: '#1e5ce2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* ✅ يقرأ من currentUser مباشرة — يتحدّث بعد الـ update */}
          <span>👨‍⚕️ Welcome, {currentUser?.fullName || 'Doctor'}</span>
          <button onClick={handleLogout} style={{ background: '#0c26d0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        {view === 'home'    && <DoctorHome    onNavigate={setView} />}
        {view === 'garde'   && <DoctorGard    onNavigate={setView} />}
        {view === 'message' && <DoctorMessage onNavigate={setView} />}
        {view === 'profile' && (
          <DoctorProfile
            doctorId={currentUser?.id}
            onNavigate={setView}
            onUpdateUser={handleUpdateUser}  // ✅
          />
        )}
        <div className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <button onClick={() => setView('home')}    style={{ background: view === 'home'    ? '#3b82f6' : 'transparent', color: view === 'home'    ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🏠 Home</button>
          <button onClick={() => setView('garde')}   style={{ background: view === 'garde'   ? '#3b82f6' : 'transparent', color: view === 'garde'   ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🛡️ Garde</button>
          <button onClick={() => setView('message')} style={{ background: view === 'message' ? '#3b82f6' : 'transparent', color: view === 'message' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>💬 Messages</button>
          <button onClick={() => setView('profile')} style={{ background: view === 'profile' ? '#3b82f6' : 'transparent', color: view === 'profile' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>👤 Profile</button>
        </div>
      </div>
    );
  };

  // ============================================
  // 👩‍⚕️ NURSE VIEW
  // ============================================
  const NurseView = () => {
    const [view, setView] = useState('home');
    const [selectedNurseId, setSelectedNurseId] = useState(currentUser?.id || null);

    const handleNavigate = (newView, nurseId = null) => {
      if (nurseId) setSelectedNurseId(nurseId);
      setView(newView);
    };

    const navStyle = (v) => ({
      background: view === v ? '#50b59a' : 'transparent',
      color: view === v ? 'white' : '#374151',
      border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    });

    return (
      <div className="nurse-interface-wrapper">
        <div className="user-header" style={{ padding: '15px 30px', background: '#50b59a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>👩‍⚕️ Welcome, {currentUser?.userId || 'Nurse'}</span>
          <button onClick={handleLogout} style={{ background: '#096842', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        {view === 'home'     && <NurseHome    onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'garde'    && <NurseGarde   onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'messages' && <NurseMessage onNavigate={handleNavigate} currentUser={currentUser} />}
        {view === 'profile'  && (
          <NurseProfile
            nurseId={selectedNurseId || currentUser?.id}
            onNavigate={handleNavigate}
            onUpdateUser={handleUpdateUser}  // ✅
          />
        )}
        <div className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <button onClick={() => handleNavigate('home')}     style={navStyle('home')}>🏠 Home</button>
          <button onClick={() => handleNavigate('garde')}    style={navStyle('garde')}>🛡️ Garde</button>
          <button onClick={() => handleNavigate('messages')} style={navStyle('messages')}>💬 Messages</button>
          <button onClick={() => handleNavigate('profile')}  style={navStyle('profile')}>👤 Profile</button>
        </div>
      </div>
    );
  };

  // ============================================
  // 💊 PHARMACIST VIEW
  // ============================================
  const PharmacistView = () => {
    const [view, setView] = useState('home');
    return (
      <div className="pharmacist-interface-wrapper">
        <div className="user-header" style={{ padding: '15px 30px', background: '#059669', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💊 Welcome, {currentUser?.nomPharmacie || 'Pharmacist'}</span>
          <button onClick={handleLogout} style={{ background: '#116b18', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        {view === 'home'     && <PharmacistHome    onNavigate={setView} currentUser={currentUser} />}
        {view === 'garde'    && <PharmacistGarde   onNavigate={setView} currentUser={currentUser} />}
        {view === 'messages' && <PharmacistMessage onNavigate={setView} currentUser={currentUser} />}
        {view === 'profile'  && (
          <PharmacistProfile
            pharmacistId={currentUser?.id}
            onNavigate={setView}
            onUpdateUser={handleUpdateUser}  // ✅
          />
        )}
        <div className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <button onClick={() => setView('home')}     style={{ background: view === 'home'     ? '#059669' : 'transparent', color: view === 'home'     ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🏠 Home</button>
          <button onClick={() => setView('garde')}    style={{ background: view === 'garde'    ? '#059669' : 'transparent', color: view === 'garde'    ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🛡️ Garde</button>
          <button onClick={() => setView('messages')} style={{ background: view === 'messages' ? '#059669' : 'transparent', color: view === 'messages' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>💬 Messages</button>
          <button onClick={() => setView('profile')}  style={{ background: view === 'profile'  ? '#059669' : 'transparent', color: view === 'profile'  ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>👤 Profile</button>
        </div>
      </div>
    );
  };

  // ============================================
  // 🚒 FIREFIGHTER VIEW
  // ============================================
  const FirefighterView = () => {
    const [view, setView] = useState('home');
    return (
      <div className="firefighter-interface-wrapper">
        <div className="user-header" style={{ padding: '15px 30px', background: '#ef4444', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🚒 Welcome, {currentUser?.matricule || currentUser?.userId || 'Firefighter'}</span>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout 🚪</button>
        </div>
        {view === 'home'     && <FirefighterHome    onNavigate={setView} currentUser={currentUser} />}
        {view === 'garde'    && <FirefighterGarde   onNavigate={setView} currentUser={currentUser} />}
        {view === 'messages' && <FirefighterMessage onNavigate={setView} currentUser={currentUser} />}
        {view === 'profile'  && (
          <FirefighterProfile
            firefighterId={currentUser?.id}
            onNavigate={setView}
            onUpdateUser={handleUpdateUser}  // ✅
          />
        )}
        <div className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <button onClick={() => setView('home')}     style={{ background: view === 'home'     ? '#ef4444' : 'transparent', color: view === 'home'     ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🏠 Home</button>
          <button onClick={() => setView('garde')}    style={{ background: view === 'garde'    ? '#ef4444' : 'transparent', color: view === 'garde'    ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>🛡️ Garde</button>
          <button onClick={() => setView('messages')} style={{ background: view === 'messages' ? '#ef4444' : 'transparent', color: view === 'messages' ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>💬 Messages</button>
          <button onClick={() => setView('profile')}  style={{ background: view === 'profile'  ? '#ef4444' : 'transparent', color: view === 'profile'  ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>👤 Profile</button>
        </div>
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
      default:            return <div>Role not found</div>;
    }
  };

  if (isCheckingAuth) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '20px' }}>⏳ Loading...</div>;

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