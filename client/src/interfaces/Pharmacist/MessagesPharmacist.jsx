import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './MessagesPharmacist.css';

const MessagesPharmacist = () => {
  const navigate = useNavigate();
  const chats = [
    { id: 1, name: 'Ph. Sara Messaoudi', msg: 'هل يمكنك مراجعة وصفة المريض رقم 402؟', time: '10:00' },
    { id: 2, name: 'Ph. Youcef Hadj', msg: 'تم توفير الدواء المطلوب', time: 'أمس' }
  ];

  return (
    <div className="messages-pharmacy-container">
      <div className="messages-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/home-pharmacy')} />
        <h2 className="header-title">Pharmacy Chats</h2>
      </div>
      
      <div className="chats-list">
        {chats.map(chat => (
          <div key={chat.id} className="chat-item">
            <div className="chat-avatar">💊</div>
            <div className="chat-info">
              <h4 className="chat-name">{chat.name}</h4>
              <p className="chat-msg">{chat.msg}</p>
            </div>
            <span className="chat-time">{chat.time}</span>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default MessagesPharmacist;