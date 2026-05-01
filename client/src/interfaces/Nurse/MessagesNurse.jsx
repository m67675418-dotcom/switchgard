import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './MessagesNurse.css';

const MessagesNurse = () => {
  const navigate = useNavigate();
  const chats = [
    { id: 1, name: 'Nurse Ahmed', msg: 'هل يمكنك تغطية مناوبتي غداً؟', time: '10:00' },
    { id: 2, name: 'Nurse Amina', msg: 'تم قبول طلب التبديل، شكراً!', time: 'أمس' }
  ];

  return (
    <div className="messages-nurse-container">
      <div className="messages-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/home-nurse')} />
        <h2 className="header-title">Nurse Chats</h2>
      </div>
      
      <div className="chats-list">
        {chats.map(chat => (
          <div key={chat.id} className="chat-item" onClick={() => navigate(`/chat/${chat.id}`, { state: { name: chat.name, emoji: '👩‍⚕️' } })}>
            <div className="chat-avatar">👩‍️</div>
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

export default MessagesNurse;