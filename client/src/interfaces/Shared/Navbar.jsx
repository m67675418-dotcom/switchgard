import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaEnvelope, FaRegCalendarAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hideNav = [
    '/', '/login', '/signup', '/role-selection',
    '/forgot-password', '/verify-code', '/reset-password'
  ].includes(location.pathname)
    || location.pathname.startsWith('/chat/')
    || location.pathname.startsWith('/chat-nurse/')
    || location.pathname.startsWith('/chat-pharmacy/')
    || location.pathname.startsWith('/chat-pompier/');

  if (hideNav) return null;

  const isNurse = location.pathname.includes('nurse');
  const isPharmacy = location.pathname.includes('pharmacy');
  const isPompier = location.pathname.includes('pompier');

  const activeColor = isNurse ? '#26c6da'
    : isPharmacy ? '#10b981'
    : isPompier ? '#ef4444'
    : '#1a73e8';

  const handleNav = (type) => {
    switch (type) {
      case 'home':
        if (isNurse) navigate('/home-nurse');
        else if (isPharmacy) navigate('/home-pharmacy');
        else if (isPompier) navigate('/home-pompier');
        else navigate('/home-doctor');
        break;
      case 'messages':
        if (isNurse) navigate('/messages-nurse');
        else if (isPharmacy) navigate('/messages-pharmacy');
        else if (isPompier) navigate('/messages-pompier');
        else navigate('/messages-doctor');
        break;
      case 'shifts':
        if (isNurse) navigate('/my-shifts-nurse');
        else if (isPharmacy) navigate('/my-shifts-pharmacy');
        else if (isPompier) navigate('/my-shifts-pompier');
        else navigate('/my-shifts-doctor');
        break;
      case 'profile':
        if (isNurse) navigate('/nurse-profile');
        else if (isPharmacy) navigate('/pharmacy-profile');
        else if (isPompier) navigate('/pompier-profile');
        else navigate('/my-profile');
        break;
      default:
        break;
    }
  };

  const getActiveStyle = (type) => {
    const paths = {
      home: isNurse ? '/home-nurse' : isPharmacy ? '/home-pharmacy' : isPompier ? '/home-pompier' : '/home-doctor',
      messages: isNurse ? '/messages-nurse' : isPharmacy ? '/messages-pharmacy' : isPompier ? '/messages-pompier' : '/messages-doctor',
      shifts: isNurse ? '/my-shifts-nurse' : isPharmacy ? '/my-shifts-pharmacy' : isPompier ? '/my-shifts-pompier' : '/my-shifts-doctor',
      profile: isNurse ? '/nurse-profile' : isPharmacy ? '/pharmacy-profile' : isPompier ? '/pompier-profile' : '/my-profile'
    };
    return {
      cursor: 'pointer',
      fontSize: '24px',
      color: location.pathname === paths[type] ? activeColor : '#ccc'
    };
  };

  return (
    <>
      {/* ← ghi logo, bla box wlla background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '10px 16px',
        zIndex: 1000,
      }}>
        <img src={logo} alt="SwitchGuard" style={{ height: '36px' }} />
      </div>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '15px 0',
        borderTop: '1px solid #eee',
        zIndex: 1000
      }}>
        <div onClick={() => handleNav('home')} style={getActiveStyle('home')}><FaHome /></div>
        <div onClick={() => handleNav('messages')} style={getActiveStyle('messages')}><FaEnvelope /></div>
        <div onClick={() => handleNav('shifts')} style={getActiveStyle('shifts')}><FaRegCalendarAlt /></div>
        <div onClick={() => handleNav('profile')} style={getActiveStyle('profile')}><FaUserCircle /></div>
      </nav>
    </>
  );
};

export default Navbar;